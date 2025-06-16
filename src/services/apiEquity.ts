import supabase from './supabase';

export async function getEquityData() {
  const { data, error } = await supabase
    .from('equity_view')
    .select('*')
    .order('invested_amount', { ascending: false });
  if (error) {
    throw new Error('Equity data could not be loaded');
  }
  return data;
}

export async function getEquitySummary(){
  const {data ,error} = await supabase
  .from('equity_total_amount_view')
  .select('*')
  if(error){
    throw new Error('Getting error in supabase');
  }
  return data;
}

export async function getEquitySummaryDaily() {
  const {data ,error} = await supabase
  .from('equity_daily_summary_with_profit')
  .select('*')
  if(error){
    throw new Error('Getting error in supabase');
  }
  return data;
}

export async function getTicker() {
  const { data, error } = await supabase.from('Equity').select('ticker');
  if (error) {
    throw new Error('Ticker data could not be loaded');
  }
  return data;
}

export async function setEquityData(row) {
  const { error } = await supabase.from('Equity').insert([row]);
  if (error) {
    throw new Error('Equity data could not be created');
  }
  return error;
}

export async function updateEquityData(id, row) {
  const { data, error } = await supabase
    .from('Equity')
    .update(row)
    .eq('id', id)
    .select();

  if (error) {
    throw new Error('Equity data could not be updated');
  }

  return data;
}

export async function upsertEquityData(row) {
  const { ticker, member_name, quantity, remark, price, isBuying } = row;

  const { data: dataEquity, error: errorEquity } = await supabase
    .from('Equity')
    .select('*')
    .eq('ticker', ticker)
    .eq('member_name', member_name);

  if (errorEquity) {
    throw new Error('Getting error in equity data loading');
  }

  const uniqueId = ticker + member_name;
  if (Object.keys(dataEquity).length === 0) {
    const equityRow = {
      id: uniqueId,
      ticker,
      quantity,
      member_name,
      remark,
      avg_buying_price: price,
    };
    const error = await setEquityData(equityRow);
    if (error) {
      throw new Error('Stock data could not be loaded: ' + error);
    }
  } else {
    const lastPrice = Number(dataEquity[0].avg_buying_price);
    const lastQuantity = Number(dataEquity[0].quantity);

    const updatedQuantity = isBuying
      ? Number(quantity) + Number(lastQuantity)
      : Number(quantity) - Number(lastQuantity);

    let updatedPrice = isBuying
      ? (price * quantity + lastPrice * lastQuantity) / updatedQuantity
      : lastPrice;
    updatedPrice = isBuying
      ? Math.round((updatedPrice + Number.EPSILON) * 100) / 100
      : updatedPrice;
    const equityRowUpdated = {
      ticker,
      quantity: updatedQuantity,
      member_name,
      remark,
      avg_buying_price: updatedPrice,
      invested_amount: updatedQuantity * updatedPrice,
    };
    console.log(equityRowUpdated);
    const updatedEquityData = await updateEquityData(
      uniqueId,
      equityRowUpdated
    );
    console.log(updatedEquityData);
  }
}

export async function setLTP(data) {
  const row = Object.entries(data).map(([key, value]) => ({
    ticker: key,
    last_trading_price: value,
  }));

  try {
    const { error: errorLTP } = await supabase.rpc('update_ltp_equity', {
      payload: row,
    });

    if (errorLTP) {
      throw new Error(errorLTP.message);
    }
  } catch (error) {
    console.error('Error:-', error);
  }
}

export async function onSellEquity(row) {
  console.log(row);
  const {
    ticker,
    member_name,
    quantity,
    price: sellingPrice,
    date: sellingDate,
    remark,
  } = row;

  const { data: dataEquity, error: errorEquity } = await supabase
    .from('Equity')
    .select('*')
    .eq('ticker', ticker)
    .eq('member_name', member_name);
  const { data: dataTradeBook, error: errorTradeBook } = await supabase
    .from('Trade_Book')
    .select('*')
    .eq('ticker', ticker)
    .eq('member_name', member_name)
    .eq('isBuying', 'TRUE')
    .eq('isBooked', 'FALSE')
    .order('date', { ascending: false });

  if (errorEquity || errorTradeBook) {
    console.log(errorEquity.message);
    console.log(errorTradeBook.message);
    throw new Error(errorEquity.message);
  }

  if (dataTradeBook.length === 0) {
    throw new Error('This stock is not in portfolio');
  }

  const totalAvlQuantity = dataTradeBook.reduce((accumulator, currentItem) => {
    return accumulator + currentItem.quantity;
  }, 0);

  if (totalAvlQuantity < Number(quantity)) {
    throw new Error(
      'Avaiable Quantity is less then selling quantity for the member'
    );
  }

  let q = Number(quantity);
  let counter = -1;

  while (q !== 0 && counter < dataTradeBook.length) {
    counter++;
    q = q - dataTradeBook[counter].quantity;

    let updateData = {
      totalQuantity: totalAvlQuantity,
      id: dataTradeBook[counter].id,
      idEquity: dataEquity[0].id,
      buying_price: dataTradeBook[counter].price,
    };

    let data = {
      ticker: ticker,
      quantity: dataTradeBook[counter].quantity,
      selling_price: sellingPrice,
      avg_buying_price: dataTradeBook[counter].price,
      amount_invested: quantity * dataTradeBook[counter].price,
      amount_booked: quantity * sellingPrice,
      profit_loss:
        quantity * sellingPrice - quantity * dataTradeBook[counter].price,
      buying_date: dataTradeBook[counter].date,
      selling_date: sellingDate,
      member_name: member_name,
      remark: remark,
    };

    if (q === 0) {
      onBookProfit(data, updateData);
      break;
    } else if (q > 0) {
      onBookProfit(data, updateData);
    } else {
      data.quantity = q + dataTradeBook[counter].quantity;
      onBookProfit(data, updateData);
    }
  }
}

export async function onBookProfit(data, updateData) {
  const { error: errorBookedProfit } = await supabase
    .from('Booked')
    .insert(data);
  if (errorBookedProfit) {
    console.log(errorBookedProfit.message);
    throw new Error(errorBookedProfit.message);
  }

  console.log(updateData);
  const { error: errorMarkIsBooked } = await supabase
    .from('Trade_Book')
    .update({ isBooked: 'TRUE' })
    .eq('id', updateData.id);

  if (errorMarkIsBooked) {
    console.log(errorMarkIsBooked.message);
    throw new Error(errorMarkIsBooked.message);
  }

  if (data.quantity === updateData.totalQuantity) {
    const response = await supabase
      .from('Equity')
      .delete()
      .eq('id', updateData.idEquity);
    console.log(response);
  } else {
    const { error: errorEquityUpdate } = await supabase
      .from('Equity')
      .update({
        quantity: Number(updateData.totalQuantity) - Number(data.quantity),
      })
      .eq('id', updateData.idEquity);

    if (errorEquityUpdate) {
      console.log(errorEquityUpdate.message);
      throw new Error(errorEquityUpdate.message);
    }
  }
}
