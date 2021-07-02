import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import axios, { AxiosError, AxiosInstance, AxiosResponse, Method } from 'axios';

import VaultConfig from 'src/config/vault.config';

interface VaultError {
  name: 'ValidationError' | 'VaultError' | 'VaultUnreachable';
  message: string;
  statusCode: number;
  error: string;
  details: string;
}

@Injectable()
export class VaultService {
  private API_PREFIX = '/api/v1';

  vaultAxios: AxiosInstance;

  constructor(
    @Inject(VaultConfig.KEY)
    vaultConfig: ConfigType<typeof VaultConfig>,
  ) {
    this.vaultAxios = axios.create({
      baseURL: vaultConfig.baseURL + this.API_PREFIX,
    });
    this.vaultAxios.defaults.headers.post['Content-Type'] = 'application/json';
  }

  public async sendRequest<T>(
    method: Method,
    path: string,
    signature?: string,
    body?: any,
    headers = {},
  ): Promise<AxiosResponse<T>> {
    if (signature) {
      return this.vaultAxios.request<T>({
        method: method,
        url: path,
        data: this.orderObject(body),
        headers: { ...headers, signature: signature },
      });
    }
    return this.vaultAxios.request<T>({
      method: method,
      url: path,
      data: this.orderObject(body),
      headers: headers,
    });
  }

  private orderObject(original: { [key: string]: any }) {
    return Object.keys(original)
      .sort()
      .reduce((ordered, key: string) => {
        let val = original[key];
        if (typeof original[key] === 'object' && original[key] !== null) {
          val = this.orderObject(val);
        }
        ordered[key] = val;
        return ordered;
      }, {});
  }
}
