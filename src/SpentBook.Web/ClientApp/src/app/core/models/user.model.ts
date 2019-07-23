import { Gender } from "./gender.model";

export class User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;  
  dateOfBirth: Date;
  gender: Gender;
}
