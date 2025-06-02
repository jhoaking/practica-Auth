"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_DATABASE = exports.SECRET_JWT_KEY = exports.SALT_ROUNDS = exports.DB_PASSWORD = exports.DB_HOST = exports.DB_USER = exports.DB_PORT = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || 4000;
exports.DB_PORT = Number(process.env.DB_PORT) || 5432;
exports.DB_USER = process.env.DB_USER || "root";
exports.DB_HOST = process.env.DB_HOST || "localhost";
exports.DB_PASSWORD = process.env.DB_PASSWORD || "mysqlcasa";
exports.SALT_ROUNDS = process.env.SALT_ROUNDS || 10;
exports.SECRET_JWT_KEY = process.env.SECRET_JWT_KEY || 4000;
exports.DB_DATABASE = process.env.NODE_ENV === "test" ? process.env.DB_TEST_DATABASE : process.env.DB_DATABASE;
