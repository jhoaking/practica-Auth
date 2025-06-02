enum Roles {"usuario" , "admin"}

export interface AuthType {
  user_id: number;
  name: string;
  email: string;
  password: string;
  createAt: Date;
  ubication: string;
  rol : Roles
}

