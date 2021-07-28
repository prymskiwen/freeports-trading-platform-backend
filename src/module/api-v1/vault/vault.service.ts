import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import axios, { AxiosError, AxiosInstance, AxiosResponse, Method } from 'axios';

import VaultConfig from 'src/config/vault.config';
import { VaultRequestDto } from './dto/vault-request.dto';

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
    request: VaultRequestDto,
  ): Promise<AxiosResponse<T>> {
    const axiosRequest: any = {
      method: request.method,
      url: request.path,
    };
    if (request.body) {
      axiosRequest.data = this.orderObject(request.body);
    }

    axiosRequest.headers = request.headers;

    return this.vaultAxios.request<T>(axiosRequest);
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
