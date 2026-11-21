import express, { type Router } from "express";
import sessionConfig from "./config/session.ts";
import cors from "cors";

interface serverOptions { port: number; routes: Router; origin: string }

export class Server{
    private readonly port:number;
    private readonly server = express();
    private readonly origin:string;
    
    constructor(options: serverOptions){
        this.port = options.port;
        this.origin = options.origin;
        this.server.use(cors({ origin: this.origin, credentials: true}));
        this.server.use(express.json());
        this.server.use(cors({ origin: this.origin }));
        this.server.use('/api',options.routes);
        this.server.use(sessionConfig);

    }

    start(){
        this.server.listen(this.port, ()=>{
            console.log(`server running on port: ${this.port}`);
        });
    }
}
