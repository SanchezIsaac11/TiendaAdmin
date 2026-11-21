import { Router } from "express";
import { ProductRoutes } from "../modules/products/products.routes.ts";
import { SaleRoutes } from "../modules/sales/sales.routes.ts";
import { UserRoutes } from "../modules/users/users.routes.ts";

export class AppRoutes {
    static get router(): Router {
        const router = Router();

        router.use("/products", ProductRoutes.router);
        router.use("/sales", SaleRoutes.router);
        router.use("/auth", UserRoutes.router);
        return router;
    }
}
