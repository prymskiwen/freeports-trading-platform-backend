export interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  refresh: boolean;
  isSecondFactorAuthenticated?: boolean;
}
