import { User } from "../user/user";

export class Filter {
  id?: string;
  name?: string;
  jsonFilter?: string;
  user?: User;
  userId?: number;
}
