import { Request, Response, NextFunction, CookieOptions } from "express";
import { catchAsync } from "middleware/catchAsync";
import { AuthService } from "service/authService";
import { validateRegister, validateLogin } from "schema/authSchema";
import { AuthType } from "types/authTypes";
import { sendEmail } from "service/enoEmailService";

export class authController {
  constructor(private model: AuthService) {}
  registerUser = catchAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
      const vali = validateRegister(req.body);

      const isAdmin = !!vali.rol;
      try {
        const user = await this.model.register(
          {
            name: vali.name,
            email: vali.email,
            password: vali.password,
            rol: vali.rol,
            ubication: vali.ubication!,
            tecnologies: vali.tecnologies,
          },
          isAdmin
        );

        //await sendEmail(user.email, user.name);
        res.status(201).json({
          message: "Usuario registrado exitosamente",
          bienvenida: `Bienvenido ${user.name}!!`,
        });
      } catch (error) {
        console.error("🔥 Error atrapado en el controller:", error);
        res.status(500).json({ error: "Error al registrar usuario" });
      }
    }
  );

  loginUser = catchAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
      const vali = validateLogin(req.body);
      const token = await this.model.login(vali.email, vali.password);
      const options: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      };

      res
        .status(201)
        .cookie("access_token", token, options)
        .json({
          message: "El usuario inició sesión con éxito!",
          bienvenida: `Bienvenido!! ${vali.email}`,token,
        });
    }
  );

  protectedRoute = catchAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
      const user = req.user as AuthType;
      if (!user) {
        res.status(401).json({ message: " no estas autorizado para ingresar" });
      }
      res.status(201).json({ message: " usuario autorizado", user });
    }
  );

  logout = catchAsync(
    async (_req: Request, res: Response, _next: NextFunction) => {
      res.clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.status(200).send({ message: "Sesión cerrada correctamente" });
    }
  );
  lookAllData = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const user = req.user as AuthType | undefined;
     console.log("🔥 Usuario en /auth/data:", user);
    if (!user || !user.user_id) {
     res.status(401).json({ message: "Usuario no autorizado" });
     return
  }
    const result = await this.model.verData(user.user_id);
    res.status(200).json({ data: result });
  })
}
