import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import axios, { AxiosError, AxiosInstance, AxiosResponse, Method } from 'axios';
import {
  KeyObject,
  createPrivateKey,
  createPublicKey,
  createSign,
  generateKeyPairSync,
} from 'crypto';
import VaultConfig from 'src/config/vault.config';
import * as fs from 'fs';
import * as path from 'path';
import { VaultResourceCreatedResponseDto } from './dto/vault-resource-created.dto';
import { GetVaultOrganizationResponseDto } from './dto/get-vault-organizations.dto';
import { GetVaultUsersResponseDto } from './dto/get-vault-users.dto';
import { VaultAccountType } from './enum/vault-account-type';

interface AuthenticateResponse {
  tokenString: string;
}

interface VaultError {
  name: 'ValidationError' | 'VaultError' | 'VaultUnreachable';
  message: string;
  statusCode: number;
  error: string;
  details: string;
}

export enum VaultPermissions {
  'GrantRevokePermission' = 'GrantRevokePermission',
  'CreateOrganizationUser' = 'CreateOrganizationUser',
  'CreateDeleteOrganization' = 'CreateDeleteOrganization',
  'CreateDeleteUser' = 'CreateDeleteUser',
  'GetUserPermissions' = 'GetUserPermissions',
  'JoinOrganizationUser' = 'JoinOrganizationUser',
  'GetUsers' = 'GetUsers',
  'GetOrganizations' = 'GetOrganizations',
  'CreateDeleteGroup' = 'CreateDeleteGroup',
  'GetGroups' = 'GetGroups',
  'CreateAccount' = 'CreateAccount',
  // 'Wipe' = 'Wipe',
}

@Injectable()
export class VaultService {
  private API_PREFIX = '/api/v1';
  private hashingAlgorithm = 'SHA256';
  private privateKey: KeyObject;
  private publicKey: KeyObject;

  private accessToken: string;

  vaultAxios: AxiosInstance;

  constructor(
    @Inject(VaultConfig.KEY)
    private vaultConfig: ConfigType<typeof VaultConfig>,
  ) {
    this.vaultAxios = axios.create({
      baseURL: vaultConfig.baseURL + this.API_PREFIX,
    });
    this.vaultAxios.defaults.headers.post['Content-Type'] = 'application/json';

    const pemPrivate = fs.readFileSync(vaultConfig.privateKey, 'utf8');
    const pemPublic = fs.readFileSync(vaultConfig.publicKey, 'utf8');
    this.privateKey = createPrivateKey(pemPrivate);
    this.publicKey = createPublicKey(pemPublic);
    this.authenticate().then();
  }

  public async createOrganization(): Promise<VaultResourceCreatedResponseDto> {
    await this.grantPermission(
      VaultPermissions.CreateDeleteOrganization,
      'user',
      '1',
    );
    const { data } = await this.sendRequest<VaultResourceCreatedResponseDto>(
      'POST',
      '/vault/organization',
      true,
    );
    return data;
  }
  public async createVaultUser(
    publicKey: string,
  ): Promise<VaultResourceCreatedResponseDto> {
    await this.grantPermission(VaultPermissions.CreateDeleteUser, 'user', '1');
    const { data } = await this.sendRequest<VaultResourceCreatedResponseDto>(
      'POST',
      '/vault/user',
      true,
      { publicKey },
    );
    return data;
  }

  public async createOrganizationUser(
    publicKey: string,
  ): Promise<VaultResourceCreatedResponseDto> {
    await this.grantPermission(VaultPermissions.CreateDeleteUser, 'user', '1');
    const { data } = await this.sendRequest<VaultResourceCreatedResponseDto>(
      'POST',
      '/organization/user',
      true,
      { publicKey },
    );
    return data;
  }

  public async getAllOrganizations(): Promise<GetVaultOrganizationResponseDto> {
    await this.grantPermission(VaultPermissions.GetOrganizations, 'user', '1');
    const { data } = await this.sendRequest<GetVaultOrganizationResponseDto>(
      'GET',
      '/vault/organization',
      true,
    );
    return data;
  }

  public async getAllVaultUsers(): Promise<GetVaultUsersResponseDto> {
    await this.grantPermission(VaultPermissions.GetUsers, 'user', '1');
    const { data } = await this.sendRequest<GetVaultUsersResponseDto>(
      'GET',
      '/vault/user',
      true,
    );
    return data;
  }

  public async getAllOrganizationUsers(): Promise<GetVaultUsersResponseDto> {
    await this.grantPermission(VaultPermissions.GetUsers, 'user', '1');
    const { data } = await this.sendRequest<GetVaultUsersResponseDto>(
      'GET',
      `/organization/user`,
      true,
    );
    return data;
  }

  public async joinOrganizationUser(
    organization: string,
    publicKey: string,
  ): Promise<VaultResourceCreatedResponseDto> {
    await this.grantPermission(
      VaultPermissions.JoinOrganizationUser,
      'user',
      '1',
    );
    const { data } = await this.sendRequest<VaultResourceCreatedResponseDto>(
      'POST',
      `/vault/organization/${organization}/user`,
      true,
      { publicKey },
    );
    return data;
  }

  public async createAccount(
    type: VaultAccountType,
  ): Promise<VaultResourceCreatedResponseDto> {
    await this.grantPermission(VaultPermissions.CreateAccount, 'user', '1');
    const { data } = await this.sendRequest<VaultResourceCreatedResponseDto>(
      'POST',
      '/vault/organization/account',
      true,
      { type },
    );
    return data;
  }
  private async authenticate() {
    const {
      data: { tokenString },
    } = await this.createToken('0');
    this.accessToken = tokenString;
    this.vaultAxios.defaults.headers.common['authorization'] = tokenString;
  }
  private async sendRequest<T>(
    method: Method,
    path: string,
    shouldHash = true,
    body?: any,
    headers = {},
  ): Promise<AxiosResponse<T>> {
    try {
      let response;
      if (shouldHash) {
        const signature = this.hashRequest(method, path, body);
        response = await this.vaultAxios.request<T>({
          method: method,
          url: path,
          data: body,
          headers: { ...headers, signature: signature },
        });
        return response;
      }
      await this.vaultAxios.request<T>({
        method: method,
        url: path,
        data: body,
        headers: headers,
      });
      return response;
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        if (error.response.data.message === 'ExpiredToken') {
          try {
            await this.authenticate();
            return this.sendRequest<T>(method, path, shouldHash, body, headers);
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  }

  private joinFirstUser() {
    const publicKeyDER = this.publicKey.export({ type: 'spki', format: 'der' });
    const publicKeyBase64 = Buffer.from(publicKeyDER).toString('base64');
    const sign = createSign(this.hashingAlgorithm);
    sign.update('1234');
    sign.update(publicKeyDER);
    const signature = sign.sign(this.privateKey, 'base64');
    return this.vaultAxios.post('/join-first-user', {
      signature,
      publicKey: publicKeyBase64,
    });
  }

  private orderObject(original) {
    return Object.keys(original)
      .sort()
      .reduce((ordered, key) => {
        let val = original[key];
        if (typeof original[key] === 'object' && original[key] !== null) {
          val = this.orderObject(val);
        }
        ordered[key] = val;
        return ordered;
      }, {});
  }

  private hashRequest(method, path, body) {
    const sign = createSign(this.hashingAlgorithm);
    sign.update(method.toUpperCase());
    sign.update(this.API_PREFIX + path);
    if (body) {
      sign.update(JSON.stringify(this.orderObject(body)));
    }
    const signature = sign.sign(this.privateKey, 'base64');
    return signature;
  }

  private createToken(organizationId) {
    const publicKeyDER = this.publicKey.export({ type: 'spki', format: 'der' });

    const reqBody = {
      publicKey: Buffer.from(publicKeyDER).toString('base64'),
      organizationId,
    };

    return this.sendRequest<AuthenticateResponse>(
      'POST',
      '/token',
      true,
      reqBody,
    );
  }

  private grantPermission(
    permissionType: VaultPermissions,
    ownerType,
    ownerId,
  ) {
    return this.sendRequest('POST', '/vault/permission', true, {
      permissionType,
      ownerType,
      ownerId,
    });
  }
  private generateKeyCrypto() {
    const { publicKey, privateKey } = generateKeyPairSync('ec', {
      namedCurve: 'prime256v1',
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });
    fs.writeFileSync(path.join(__dirname, './private.key'), privateKey);
    fs.writeFileSync(path.join(__dirname, './public.key'), publicKey);
  }
}
