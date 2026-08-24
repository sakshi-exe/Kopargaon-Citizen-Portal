import { supabase } from "./supabase"

export async function testSupabase() {
  const { data, error } = await supabase
    .from("issues")
    .select("*")
    .limit(1)

  console.log("Supabase data:", data)
  console.log("Supabase error:", error)
}