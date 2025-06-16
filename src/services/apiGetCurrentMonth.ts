export default function getCurrentMonth() {
  const currentDate = new Date();

  const currentMonthIndex = currentDate.getMonth(); // 0-based index
  const currentMonthNumber = currentMonthIndex + 1; // 1-based number (1 to 12)

  const currentMonthTwoDigits = String(currentMonthNumber).padStart(2, '0');

  let previousMonthIndex; // 0-based

  
  if (currentMonthIndex === 0) {
    // If it's January, the previous month is December (index 11)
    previousMonthIndex = 11;
    // The previous year is the current year minus one
  } else {
    // If it's not January, just subtract one from the current month index
    previousMonthIndex = currentMonthIndex - 1;
    // The year remains the same
  }
  const previousMonthNumber = previousMonthIndex + 1;
  const previousMonthTwoDigits = String(previousMonthNumber).padStart(2, '0');
  const currentYear = currentDate.getFullYear();

  const firstDayOfNextMonth = new Date(currentYear, currentMonthIndex + 1, 1);
  const lastDayOfCurrentMonth = new Date(firstDayOfNextMonth);
  lastDayOfCurrentMonth.setDate(firstDayOfNextMonth.getDate() - 1);
  const daysInCurrentMonth = lastDayOfCurrentMonth.getDate();

  const firstDayofCurrentMonth = new Date(currentYear, currentMonthIndex, 1);
  const lastDayofPreviousMonth = new Date(firstDayofCurrentMonth);
  lastDayofPreviousMonth.setDate(firstDayofCurrentMonth.getDate() - 1);
  const daysInPreviousMonth = lastDayofPreviousMonth.getDate();

  return {
    currentMonthTwoDigits,
    daysInCurrentMonth,
    currentYear,
    previousMonthTwoDigits,
    daysInPreviousMonth,
  };
}
