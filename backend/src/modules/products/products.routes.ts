import { Router } from "express";
import { ProductController } from "./products.controller.ts";

export class ProductRoutes {

    static get router(): Router {

        const router = Router();
        const productController = new ProductController();

        router.get("/", productController.getProducts);
        router.get("/categories", productController.getCategories);
        router.get("/:id", productController.getProductById);
        router.get("/category/:categoryId",productController.getProductsByCategory);
        router.post("/", productController.createProduct);
        router.put("/:id", productController.updateProductById);
        router.delete("/:id", productController.deleteProductById);

        return router;
    }
}
