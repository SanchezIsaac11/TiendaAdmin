import { Router } from "express";
import { SaleController } from "./sales.controller.ts";
import { validateCreateSale, validateSaleId, validateUpdateSale } from "./sales.validators.ts";
import { authMiddleware } from "../../session/auth.middleware.ts";

export class SaleRoutes {
    static get router(): Router {
        const router = Router();
        const saleController = new SaleController();

        router.get("/", authMiddleware("admin"), saleController.getSales);
        router.get("/:id", authMiddleware("admin"), validateSaleId, saleController.getSaleById);
        router.post("/", authMiddleware("admin"), validateCreateSale, saleController.createSale);
        router.put("/:id", authMiddleware("admin"), validateSaleId, validateUpdateSale, saleController.updateSaleById);
        router.delete("/:id", authMiddleware("admin"), validateSaleId, saleController.deleteSaleById);

        return router;
    }
}

