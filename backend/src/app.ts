import { Server } from "./server.ts";
import { AppRoutes } from "./routes/index.ts";
import dotenv from "dotenv";
dotenv.config();

const port = Number(process.env.PORT);

function main() {
  try {
    const server = new Server({ port, routes: AppRoutes.router });
    server.start();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();