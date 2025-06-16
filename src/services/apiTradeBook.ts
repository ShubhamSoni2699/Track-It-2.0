// import { setEquityData, updateEquityData } from "./apiEquity";
import supabase from "./supabase";

export async function getTradeBookData() {
  const { data, error } = await supabase.from("Trade_Book").select("*");
  if (error) {
    throw new Error("Trade Book data could not be loaded");
  }
  return data;
}

export async function setTradeBookData({
  ticker,
  price,
  quantity,
  date,
  member,
  remark,
  isBuying,
}) {
  const row = {
    ticker,
    quantity,
    date,
    member_name: member,
    remark,
    price,
    isBuying,
  };

  const { error: errorTradeBook } = await supabase
    .from("Trade_Book")
    .insert([row]);
  if (errorTradeBook) {
    throw new Error("Trade data could not be created");
  }

  return row;
}

export async function deleteTradeBookData(id) {
  const { data, error } = await supabase
    .from("Trade_Book")
    .delete()
    .eq("id", id);
  if (error) {
    console.log(error);
    throw new Error("Trade Book data could not be deleted");
  }
  return data;
}
