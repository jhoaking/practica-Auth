"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const pg_1 = __importDefault(require("pg"));
const config_1 = require("./config");
exports.connect = new pg_1.default.Pool({
    user: config_1.DB_USER,
    database: config_1.DB_DATABASE,
    password: config_1.DB_PASSWORD,
    host: config_1.DB_HOST,
    port: config_1.DB_PORT,
});
