
import supabase from "../src/config/supabase.connection.ts";

async function testConnection() {

    const { data, error } = await supabase
        .from("products")
        .select("*")
        .limit(1);

    if (error) {
        console.error("Error de conexión o consulta:", error.message);
        return;
    }

    console.log("¡Conexión con Supabase exitosa!");
    console.log(data);
}

testConnection();
