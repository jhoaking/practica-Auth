import { authClass } from "model/authModel";
import { JwtPayload } from "jsonwebtoken";
import { utilAuth } from "utils/authUtils";
import { RegisterType } from "types/authTypes";
export class AuthService {
  constructor(private model: authClass) {}

  async register(data: RegisterType, isAdmin: boolean) {
    const foundEmail = await this.model.verifyEmail(data.email);
    if (foundEmail) {
      throw new Error("este email ya fue registrado");
    }

    const user = await this.model.registerAuth(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        rol: data.rol,
        ubication: data.ubication,
        tecnologies: data.tecnologies,
      },
      isAdmin
    );
    return user;
  }
  async login(email: string, password: string): Promise<string> {
    const user = await this.model.verifyEmail(email);
    if (!user) {
      throw new Error("email no encontrado");
    }

    const paswordValid = await utilAuth.comparePassword(
      password,
      user.password
    );
    if (!paswordValid) {
      throw new Error("contraseña incorrecta");
    }
    const payload: JwtPayload = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      createAt: user.createAt,
      rol: user.rol,
      ubication: user.ubication,
    };
    const token = utilAuth.createToken(payload);
    return token;
  }
}
