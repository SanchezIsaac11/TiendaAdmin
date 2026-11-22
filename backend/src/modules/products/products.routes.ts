import { Router } from "express";
import { ProductController } from "./products.controller.ts";
import { authMiddleware } from "../../session/auth.middleware.ts";
import { ProductValidator } from "./products.validators.ts"

export class ProductRoutes {

    static get router(): Router {

        const router = Router();
        const productController = new ProductController();

        router.get("/", authMiddleware(), productController.getProducts);
        router.get("/categories", authMiddleware(), productController.getCategories);
        router.get("/:id", authMiddleware(), ProductValidator.validateProductId, productController.getProductById);
        router.get("/category/:categoryId", authMiddleware(), ProductValidator.validateCategoryId, productController.getProductsByCategory);
        router.post("/", authMiddleware(), ProductValidator.validateCreateProduct, productController.createProduct);
        router.put("/:id", authMiddleware(), ProductValidator.validateUpdateProduct, productController.updateProductById);
        router.delete("/:id", authMiddleware(), ProductValidator.validateProductId, productController.deleteProductById);

        return router;
    }
}
