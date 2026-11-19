import type { Request, Response } from "express";
import supabase from "../../config/supabase.connection.ts";

export class ProductController {
    public async getProducts(req: Request, res: Response) {
        try {
            const { data: products, error } = await supabase.from("products").select("*");
            if (error) throw error;
            return res.status(200).json(products);

        } catch (error) {
            console.error("Error getting products:", error);

            return res.status(500).json({ message: "Internal server error" });
        }
    }

    public async getProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { data: product, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();

            if (error) throw error;

            if (!product) return res.status(404).json({ message: "Product not found" });

            return res.status(200).json(product);

        } catch (error) {
            console.error("Error getting product:", error);

            return res.status(500).json({ message: "Internal server error" });
        }
    }

    public async createProduct(req: Request, res: Response) {
        try {
            const { data: product, error } = await supabase.from("products").insert(req.body).select().single();

            if (error) throw error;

            return res.status(201).json({ message: "Product created", product });

        } catch (error) {
            console.error("Error creating product:", error);

            return res.status(500).json({ message: "Internal server error" });
        }
    }

    public async updateProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const { data: product, error } = await supabase.from("products").update(req.body).eq("id", id).select().maybeSingle();

            if (error) throw error;

            if (!product) return res.status(404).json({ message: "Product not found" });

            return res.status(200).json({ message: "Product updated", product });

        } catch (error) {
            console.error("Error updating product:", error);

            return res.status(500).json({ message: "Internal server error" });
        }
    }

    public async deleteProductById(req: Request, res: Response) {
        try {
            const { id } = req.params; 

            const { data: product, error } = await supabase.from("products").delete().eq("id", id).select().maybeSingle();

            if (error) throw error;

            if (!product) return res.status(404).json({ message: "Product not found" });

            return res.status(200).json({ message: "Product deleted" });

        } catch (error) {
            console.error("Error deleting product:", error);

            return res.status(500).json({ message: "Internal server error" });
        }
    }

    public async getCategories(req: Request, res: Response) {
        try {
            const { data, error } = await supabase.from("categories").select("*");

            if (error) throw error;

            return res.status(200).json(data);

        } catch (error) {
            console.error(error);

            return res.status(500).json({ message: "Internal server error" });
        }
    }

    public async getProductsByCategory(req: Request, res: Response) {
        try {
            const { categoryId } = req.params;

            const { data, error } = await supabase.from("products").select("*").eq("id_category", categoryId);

            if (error) throw error;

            return res.status(200).json(data);

        } catch (error) {
            console.error(error);

            return res.status(500).json({ message: "Internal server error" });
        }
    }

}
