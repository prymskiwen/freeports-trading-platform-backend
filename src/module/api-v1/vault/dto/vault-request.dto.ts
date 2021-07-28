enum Method {
  'POST' = 'POST',
  'GET' = 'GET',
  'DELETE' = 'DELETE',
}
export class VaultRequestDto {
  method: Method;
  path: string;
  body?: any;
  signature?: string;
  headers?: {
    signature?: string;
    authorization?: string;
  };
}
