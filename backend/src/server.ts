import express, { type Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface serverOptions { port: number; routes: Router; }

export class Server{
    private readonly port:number;
    private readonly server = express();
    constructor(options: serverOptions){
        this.port = options.port;
        this.server.use(cors());
        this.server.use(express.json());
        this.server.use('/api',options.routes);

        // Servir archivos estáticos del frontend
        const frontendPath = path.join(__dirname, '../../frontend');
        this.server.use(express.static(frontendPath));
    }

    start(){
        this.server.listen(this.port, ()=>{
            console.log(`server running on port: ${this.port}`);
        });
    }
}
