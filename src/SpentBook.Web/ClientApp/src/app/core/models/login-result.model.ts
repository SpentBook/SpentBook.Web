export class LoginResult {
  userId: string;
  token: string;
  secondsToExpires: number;
  requireConfirmedEmail: boolean;
  requiresTwoFactor: boolean;
  requireConfirmedPhoneNumber: boolean;
}