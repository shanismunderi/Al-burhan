import { supabase } from "./client";
import { supabaseAdmin as realAdmin } from "@/lib/db.server";

export const supabaseAdmin = realAdmin || supabase;

