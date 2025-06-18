import supabase from "./supabase";

export async function getTag(isCredit:Boolean) {
  const { data, error } = isCredit
    ? await supabase.from("Tag").select("*").eq("type", "cr")
    : await supabase.from("Tag").select("*").eq("type", "dr");
  if (error) {
    throw new Error("Tags could not be loaded");
  }
  return data;
}
