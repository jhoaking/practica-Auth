import { Roles, AuthType } from "types/authTypes";
import { Request, Response, NextFunction } from "express";

export const permisoRol = (...rolesPermiso: Roles[]) => {
  return (
    req: Request & { user?: AuthType },
    res: Response,
    next: NextFunction
  ) => {
    const rol = req.user?.rol;
    if (!rol || !rolesPermiso.includes(rol)) {
      res.status(403).json({ message: "no tienes permitido entrar aqui" });
    }
    next();
  };
};
