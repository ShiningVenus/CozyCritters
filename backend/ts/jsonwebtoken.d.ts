declare module 'jsonwebtoken' {
  export interface SignOptions {
    algorithm?: string;
    expiresIn?: string | number;
  }
  export interface VerifyOptions {
    algorithms?: string[];
  }
  export interface JwtPayload {
    exp?: number;
    [key: string]: any;
  }
  export function sign(
    payload: string | object | Buffer,
    secret: string,
    options?: SignOptions
  ): string;
  export function verify(
    token: string,
    secret: string,
    options?: VerifyOptions
  ): JwtPayload;
}
