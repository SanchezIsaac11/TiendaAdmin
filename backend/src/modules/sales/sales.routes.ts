import { Router } from "express";
import { SaleController } from "./sales.controller.ts";
import { validateCreateSale, validateSaleId, validateUpdateSale } from "./sales.validators.ts";

export class SaleRoutes {
    static get router(): Router {
        const router = Router();
        const saleController = new SaleController();

        router.get("/", saleController.getSales);
        router.get("/:id", validateSaleId, saleController.getSaleById);
        router.post("/", validateCreateSale, saleController.createSale);
        router.put("/:id", validateSaleId, validateUpdateSale, saleController.updateSaleById);
        router.delete("/:id", validateSaleId, saleController.deleteSaleById);

        return router;
    }
}

