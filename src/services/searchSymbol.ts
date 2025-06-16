import { nseData } from "../data/nse-data";
import { bseData } from "../data/bse-data";

export default async function searchSymbol(exchange, companyIntials) {
  let symbolList = "";
  if (exchange === "nse") {
    symbolList = nseData
      .filter((stockInfo) =>
        stockInfo["NAME OF COMPANY"]
          .toLowerCase()
          .includes(companyIntials.toLowerCase())
      )
      .map((stockInfo) => stockInfo["SYMBOL"]);
  } else {
    symbolList = bseData
      .filter(
        (stockInfo) =>
          stockInfo["Instrument"] === "Equity" &&
          stockInfo["Security Name"].toLowerCase().includes(companyIntials)
      )
      .map((stockInfo) => stockInfo["Security Id"]);
  }
  return symbolList;
}
