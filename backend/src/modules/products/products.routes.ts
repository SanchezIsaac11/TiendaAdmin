import { Router } from "express";
import { ProductController } from "./products.controller.ts";
import { authMiddleware } from "../../session/auth.middleware.ts";
import { validateCreateProduct, validateUpdateProduct, validateCategoryId, validateProductId } from "./products.validators.ts"

export class ProductRoutes {

    static get router(): Router {

        const router = Router();
        const productController = new ProductController();

        router.get("/", authMiddleware(), productController.getProducts);
        router.get("/categories", authMiddleware(), validateCategoryId, productController.getCategories);
        router.get("/:id", authMiddleware(), validateProductId, productController.getProductById);
        router.get("/category/:categoryId", authMiddleware(),productController.getProductsByCategory);
        router.post("/", authMiddleware(), validateCreateProduct, productController.createProduct);
        router.put("/:id", authMiddleware(), validateUpdateProduct, productController.updateProductById);
        router.delete("/:id", authMiddleware(), validateProductId, productController.deleteProductById);

        return router;
    }
}
