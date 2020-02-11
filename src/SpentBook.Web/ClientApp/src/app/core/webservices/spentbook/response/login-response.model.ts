export class LoginResponse {
  userId: string;
  email: string;
  token: string;
  secondsToExpires: number;
  requireConfirmedEmail: boolean;
  requiresTwoFactor: boolean;
  requireConfirmedPhoneNumber: boolean;
}