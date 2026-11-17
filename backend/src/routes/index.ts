import { Router } from "express";
import {ProductRoutes} from "../modules/products/products.routes.ts";

export class AppRoutes {
    static get router(): Router {
        const router = Router();

        router.use("/products", ProductRoutes.router);
        return router;
    }
}