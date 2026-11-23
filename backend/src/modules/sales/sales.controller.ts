import type { Request, Response } from "express";
import supabase from "../../config/supabase.connection.ts";

export class SaleController {
    public async getSales(_req: Request, res: Response) {
        try {
            const { data: sales, error } = await supabase.from("sale").select("*");

            if (error) throw error;

            return res.status(200).json(sales);
        } catch (error) {
            console.error("Error getting sales:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    public async getSaleById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { data: sale, error } = await supabase.from("sale").select("*").eq("id", id).maybeSingle();

            if (error) throw error;

            if (!sale) return res.status(404).json({ message: "Sale not found" });

            return res.status(200).json(sale);
        } catch (error) {
            console.error("Error getting sale:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    public async createSale(req: Request, res: Response) {
        try {
            const { data: sale, error } = await supabase.from("sale").insert(req.body).select().single();

            if (error) throw error;

            return res.status(201).json({ message: "Sale created", sale });
        } catch (error) {
            const pgError = error as { code?: string };

            if (pgError?.code === "23505") {
                return res.status(409).json({ message: "El folio ya existe" });
            }

            if (pgError?.code === "23503") {
                return res.status(400).json({ message: "El cajero especificado no existe" });
            }

            console.error("Error creating sale:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    public async updateSaleById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { data: sale, error } = await supabase.from("sale").update(req.body).eq("id", id).select().maybeSingle();

            if (error) throw error;

            if (!sale) return res.status(404).json({ message: "Sale not found" });

            return res.status(200).json({ message: "Sale updated", sale });
        } catch (error) {
            const pgError = error as { code?: string };

            if (pgError?.code === "23505") {
                return res.status(409).json({ message: "El folio ya existe" });
            }

            if (pgError?.code === "23503") {
                return res.status(400).json({ message: "El cajero especificado no existe" });
            }

            console.error("Error updating sale:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    public async deleteSaleById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { data: sale, error } = await supabase.from("sale").delete().eq("id", id).select().maybeSingle();

            if (error) throw error;

            if (!sale) return res.status(404).json({ message: "Sale not found" });

            return res.status(200).json({ message: "Sale deleted" });
        } catch (error) {
            console.error("Error deleting sale:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

