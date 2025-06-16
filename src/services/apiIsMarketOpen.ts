export async function isMarketOpen() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const istOffset = 5.5 * 60 * 60000;
  const istTime = new Date(utc + istOffset);
  const day = istTime.getDay();
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();

  if (day === 0 || day === 6) {
    return false;
  }

  const openTime = 9 * 60 + 15;
  const closeTime = 15 * 60 + 30;
  const currentTime = hours * 60 + minutes;

  return currentTime >= openTime && currentTime <= closeTime;
}
