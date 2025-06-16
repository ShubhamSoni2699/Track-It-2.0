import supabase from "./supabase";

export async function getMembersData() {
  const { data, error } = await supabase.from("Family_Members").select("*");
  if (error) {
    console.log(error);
    throw new Error("Members data could not be loaded");
  }
  return data;
}
