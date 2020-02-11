export class JwtToken {
  sub: string;
  jti: string;
  iat: number;
  roles: string[];  
  id: string;
  nbf: number;
  exp: number;
  iss: string;
  aud: string;
}
