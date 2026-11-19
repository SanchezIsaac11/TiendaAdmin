
import dotenv from "dotenv";

dotenv.config();

const {
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
} = process.env;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("Faltan las variables de entorno de Supabase");
}

const dbConnections = {
    supabaseUrl: SUPABASE_URL,
    supabaseKey: SUPABASE_PUBLISHABLE_KEY
};

export default dbConnections;
