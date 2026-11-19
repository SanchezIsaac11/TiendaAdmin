import { createClient } from "@supabase/supabase-js";
import dbConnections from "./dbConnections.ts";

const supabase = createClient(
    dbConnections.supabaseUrl,
    dbConnections.supabaseKey
);

export default supabase;
