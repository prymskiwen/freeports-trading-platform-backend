import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiLinks(): string {
    return '<a href="/api/v1">API V1</a>';
  }
}
