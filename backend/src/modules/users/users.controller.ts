import type { Request, Response } from "express";
import supabase from "../../config/supabase.connection.ts";

export class UserController {
    public async getUsers(_req: Request, res: Response) {
        try {
            const { data: users, error } = await supabase.from("user").select("id, name, role");

            if (error) throw error;

            return res.status(200).json(users);
        } catch (error) {
            console.error("Error getting users:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    public async login(req: Request, res: Response) {
        console.log("User logged in:", req.session.user);
        try {
            const { name, password } = req.body;
            const { data: user, error } = await supabase.from("user").select("id, name, password, role").eq("name", name).maybeSingle();

            if (error) throw error;

            if (!user || user.password !== password) return res.status(401).json({ message: "Nombre de usuario o contraseña inválidos" });

            req.session.user = {
                id: user.id,
                name: user.name,
                role: user.role
            };

            console.log("User logged in:", req.session.user);
            return res.status(200).json({ message: "Usuario conectado correctamente", user: req.session.user });
        } catch (err) {
            console.error("Error logging in:", err);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    public async logout(req: Request, res: Response) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: "Error al cerrar sesión" });
            }
            res.clearCookie("connect.sid");
            return res.status(200).json({ message: "Usuario desconectado correctamente" });
        });
    }

    public async getCurrentUser(req: Request, res: Response) {
        if (!req.session.user) {
            return res.status(401).json({
                message: "Usuario no autenticado"
            });
        }

        return res.status(200).json(req.session.user);
    }

    public async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { data: user, error } = await supabase.from("user").select("id, name, role").eq("id", id).maybeSingle();

            if (error) throw error;

            if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

            return res.status(200).json(user);
        } catch (error) {
            console.error("Error getting user:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    public async createUser(req: Request, res: Response) {
        try {
            const { data: user, error } = await supabase.from("user").insert(req.body).select("id, name, role").single();

            if (error) throw error;

            return res.status(201).json({ message: "Usuario creado", user });
        } catch (error) {
            const pgError = error as { code?: string };

            if (pgError?.code === "23505") {
                return res.status(409).json({ message: "El usuario ya existe" });
            }

            console.error("Error creating user:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    public async updateUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { data: user, error } = await supabase.from("user").update(req.body).eq("id", id).select("id, name, role").maybeSingle();

            if (error) throw error;

            if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

            return res.status(200).json({ message: "Usuario actualizado correctamente", user });
        } catch (error) {
            const pgError = error as { code?: string };

            if (pgError?.code === "23505") {
                return res.status(409).json({ message: "El usuario ya existe" });
            }

            console.error("Error updating user:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }

    public async deleteUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { data: user, error } = await supabase.from("user").delete().eq("id", id).select("id, name, role").maybeSingle();

            if (error) throw error;

            if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

            return res.status(200).json({ message: "Usuario eliminado" });
        } catch (error) {
            console.error("Error deleting user:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }
}
