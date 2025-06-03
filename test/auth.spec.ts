import request from "supertest";
import { app } from "app";
import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY } from "config";

describe("AUTH", () => {
  const user = {
    name: "Test",
    email: "asdasdasdasd@gmail.com", // un email que sí exista
    password: "123456",
    rol: "admin",
    tecnologies: ["ux", "ui","dev" , "backend"],
    ubication: "las lomas",
    createAt: Date.now(),
  };
  describe("POST /register", () => {
    test("deberia mandar un 201 si se creo con exito el usuario", async () => {
      const res = await request(app).post("/auth/register").send(user);
      expect(res.status).toBe(201);
    });
  });

  describe("GET /auth/data", () => {
    test("deberia mandar un 200 si se mostraron bien los resultados", async () => {
      const loginUser = await request(app).post("/auth/login").send({
        email: user.email,
        password: user.password,
      });
      const cookie = loginUser.headers["set-cookie"];
      const res = await request(app).get("/auth/data").set("Cookie", cookie);

      expect(res.status).toBe(200);
    });
  });

  describe("POST /login", () => {
    test("deberia mandar un 201 si el token se creo correctamente al usuario", async () => {
      const res = await request(app).post("/auth/login").send(user);
      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();

      const decoded = jwt.verify(res.body.token, SECRET_JWT_KEY);

      expect(decoded).toHaveProperty("user_id");
      expect(decoded).toHaveProperty("email", user.email);
    });
  });

  describe("GET /protected", () => {
    test("deberia mandar un 201 si se pudo acceder a la ruta protegida", async () => {
      const loginUser = await request(app).post("/auth/login").send(user);

      const cookie = loginUser.headers["set-cookie"];

      const res = await request(app)
        .get("/auth/protected")
        .set("cookie", cookie);
      expect(res.status).toBe(201);
    });
  });

  describe("GET /logout", () => {
    test("deberia mandar un 200 si la sesion se cerro con exito", async () => {
      const res = await request(app).get("/auth/logout").send(user);
      expect(res.status).toBe(200);
    });
  });
});
