import { closeSync, existsSync, mkdirSync, openSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";

if (existsSync(".env")) process.loadEnvFile(".env");
const url = process.env.DATABASE_URL ?? "file:./dev.db";
if (!url.startsWith("file:")) process.exit(0);
const configuredPath = url.slice(5);
const databasePath = isAbsolute(configuredPath) ? configuredPath : resolve("prisma", configuredPath);
mkdirSync(dirname(databasePath), { recursive: true });
if (!existsSync(databasePath)) closeSync(openSync(databasePath, "w"));
