import express, { type Router } from "express";
import sessionConfig from "./config/session.ts";
import cors from "cors";

interface serverOptions { port: number; routes: Router; origin: string }

export class Server {
    private readonly port: number;
    private readonly server = express();

    constructor(options: serverOptions) {
        this.port = options.port;

        const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").map(origin => origin.trim()).filter(Boolean) ?? [];

        this.server.use(cors({
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin) ) {
                    callback(null, true);
                } else {
                    callback(new Error("Not allowed by CORS"));
                }
            },
            credentials: true
        }));

        this.server.use(express.json());
        this.server.use(sessionConfig);
        this.server.use('/api', options.routes);
    }

    start() {
        this.server.listen(this.port, () => { console.log(`Server running on port: ${this.port}`); });
    }
}
