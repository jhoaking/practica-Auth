import { registerUserType } from "schema/authSchema";
import { connect } from "../db";
import { AuthType } from "types/authTypes";
import { controlRolAuth } from "./controlRol";
import { utilAuth } from "utils/authUtils";
import { QueryResult } from "pg";

export class authClass {
   registerAuth = async (
    data: registerUserType,
    isAdmin: boolean
  ): Promise<AuthType> => {
    try {
      const nombreRol = isAdmin ? data.rol: "usuario";
      const rol = await controlRolAuth.getRol(nombreRol);
      const query =
        "INSERT INTO users_tb(name,email,password,createAt,ubication,rol_id) VALUES($1,$2,$3,NOW(),$4,$5) RETURNING *;";
      const passwordHashed = await utilAuth.hashPassword(data.password);
      const values = [
        data.name,
        data.email,
        passwordHashed,
        data.ubication,
        rol,
      ];

      const result: QueryResult<AuthType> = await connect.query(query, values);
      const user = result.rows[0];

      for (const nombreTecno of data.tecnologies) {
        const queryTecno = "SELECT skill_id FROM skills_tb WHERE nombre = $1 ";
        const resultTecno = await connect.query(queryTecno, [nombreTecno]);

        let idTecnologia: number;

        if (resultTecno.rows.length === 0) {
          const insertarTecno = await connect.query(
            "INSERT INTO skills_tb(nombre) VALUES ($1) RETURNING skill_id",
            [nombreTecno]
          );
          idTecnologia = insertarTecno.rows[0].skill_id;
        } else {
          idTecnologia = resultTecno.rows[0].skill_id;
        }
        await connect.query(
          "INSERT INTO usuarios_skills_tb (user_id ,skill_id)VALUES($1,$2)",
          [user.user_id, idTecnologia]
        );
      }
      return user;
    } catch (error: any) {
      console.error(error);
      throw new Error("Error en el registro");
    }
  };

   async verifyEmail(email: string): Promise<AuthType | null> {
    const query = "SELECT * FROM users_tb WHERE email = $1";
    const result = await connect.query(query, [email]);
    return result.rows[0] || null;
  }
}
