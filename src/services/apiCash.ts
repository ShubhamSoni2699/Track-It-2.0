import supabase from './supabase';

export async function getCashData() {
  let query = supabase
    .from('Cash')
    .select('*')
    .order('date', { ascending: false });
  const { data, error } = await query;
  if (error) {
    throw new Error('Cash data could not be loaded');
  }
  return data;
}

export async function getCashSummary() {
  let query = supabase
    .from('cash_summary')
    .select('*')
  const { data, error } = await query;
  if (error) {
    throw new Error('Cash Summary data could not be loaded');
  }
  return data;
}

export async function getDailyCashSummary() {
  let query = supabase
    .from('cash_daily_summary')
    .select('*')
  const { data, error } = await query;
  if (error) {
    throw new Error('Cash Daily Summary data could not be loaded');
  }
  return data;
}

export async function getLastestTransectionId() {
  const { data, error } = await supabase
    .from('Cash')
    .select('id')
    .limit(1)
    .single()
    .order('date', { ascending: false })
    .order('id', { ascending: false });
  if (error) {
    console.log(error.message, error.details);
    throw new Error('last transection id could not be loaded');
  }
  return data;
}

export async function setCashData(cashRow) {
  const { error: errorCash } = await supabase.from('Cash').insert([cashRow]);
  if (errorCash) {
    throw new Error('Cash data could not be created');
  }
  return cashRow;
}

export async function deleteCashData(id) {
  const { data, error: errorDeleteCash } = await supabase
    .from('Cash')
    .delete()
    .eq('id', id);
  if (errorDeleteCash) {
    console.log(errorDeleteCash);
    throw new Error('Trade Book data could not be deleted');
  }
  return data;
}

export async function getTotalCash() {
  const { data: dataCredit, error: errorCredit } = await supabase
    .from('Cash')
    .select('amount.sum()')
    .single()
    .eq('credit_debit', 'cr');
  if (errorCredit) {
    console.log(errorCredit.details);
    throw new Error('Error in Getting Sum of credit amount');
  }

  const { data: dataDebit, error: errorDebit } = await supabase
    .from('Cash')
    .select('amount.sum()')
    .single()
    .eq('credit_debit', 'dr');
  if (errorDebit) {
    console.log(errorDebit.details);
    throw new Error('Error in Getting Sum of debit amount');
  }

  return { totalCapital: dataCredit.sum - dataDebit.sum };
}

