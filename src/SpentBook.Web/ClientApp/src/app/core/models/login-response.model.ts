import { User } from "./user.model";

export class LoginResponse {
  user: User;
  token: string;
}
