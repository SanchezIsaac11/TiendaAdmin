import type { Request, Response } from "express";
import supabase from "../../config/supabase.connection.ts";

export class UserController {
    public async getUsers(_req: Request, res: Response) {
        try {
            const { data: users, error } = await supabase.from("users").select("id, name, role");

            if (error) throw error;

            return res.status(200).json(users);
        } catch (error) {
            console.error("Error getting users:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    public async getUserByName(req: Request, res: Response) {
        try{
            const { name } = req.params;
            const { data: user, error } = await supabase.from("users").select("id, name, role").eq("name", name).maybeSingle();

            if (error) throw error;

            if (!user) return res.status(404).json({ message: "User not found" });

            return res.status(200).json(user);
        }catch(err) {
            console.error("Error getting user:", err);
            return res.status(500).json({ message: "Internal server error"});
        }
    }

    public async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { data: user, error } = await supabase.from("users").select("id, name, role").eq("id", id).maybeSingle();

            if (error) throw error;

            if (!user) return res.status(404).json({ message: "User not found" });

            return res.status(200).json(user);
        } catch (error) {
            console.error("Error getting user:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    public async createUser(req: Request, res: Response) {
        try {
            const { data: user, error } = await supabase.from("users").insert(req.body).select("id, name, role").single();

            if (error) throw error;

            return res.status(201).json({ message: "User created", user });
        } catch (error) {
            const pgError = error as { code?: string };

            if (pgError?.code === "23505") {
                return res.status(409).json({ message: "El usuario ya existe" });
            }

            console.error("Error creating user:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    public async updateUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { data: user, error } = await supabase.from("users").update(req.body).eq("id", id).select("id, name, role").maybeSingle();

            if (error) throw error;

            if (!user) return res.status(404).json({ message: "User not found" });

            return res.status(200).json({ message: "User updated", user });
        } catch (error) {
            const pgError = error as { code?: string };

            if (pgError?.code === "23505") {
                return res.status(409).json({ message: "El usuario ya existe" });
            }

            console.error("Error updating user:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    public async deleteUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { data: user, error } = await supabase.from("users").delete().eq("id", id).select("id, name, role").maybeSingle();

            if (error) throw error;

            if (!user) return res.status(404).json({ message: "User not found" });

            return res.status(200).json({ message: "User deleted" });
        } catch (error) {
            console.error("Error deleting user:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
