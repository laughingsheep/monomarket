export function getStocks(){
  if(!localStorage.getItem('stocks')){
    localStorage.setItem('stocks', JSON.stringify([]));
  }
  return JSON.parse(localStorage.getItem('stocks'));
}
export function setStocks(stocks){
  localStorage.setItem('stocks', JSON.stringify(stocks));
}
export function getStockAmount(slug, yesNo){
  let stocks = getStocks();
  const stock = stocks.find(s => s.slug === slug && s.yesNo === yesNo);
  return stock ? stock.amount : 0;
}
export function removeStock(slug, yesNo, amount){
  let stocks = getStocks();
  const idx = stocks.findIndex(s => s.slug === slug && s.yesNo === yesNo);
  if (idx !== -1) {
    stocks[idx].amount -= amount;
    if (stocks[idx].amount <= 0) {
      stocks.splice(idx, 1);
    }
    setStocks(stocks);
  }
}
export function removeAllStock(slug){
  let stocks = getStocks();
  stocks = stocks.filter(s => s.slug !== slug);
  setStocks(stocks);
}
export function formatCoins(amount) {
  const usd = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);

  // Replace the first currency symbol occurrence
  return usd.replace(/^\$/, '') +  " 🪙";
}
export function colorForValue(v){
  v=Math.max(0,Math.min(100,+v));
  const h=x=>{x=x.replace("#","");if(x.length===3)x=x.split("").map(c=>c+c).join("");return [parseInt(x.slice(0,2),16),parseInt(x.slice(2,4),16),parseInt(x.slice(4,6),16)]};
  const p=v<=50?0:50,q=v<=50?50:100;
  const [ar,ag,ab]=v<=50?h("#D90D0D"):h("#C7C757");
  const [br,bg,bb]=v<=50?h("#C7C757"):h("#0DFF00");
  const t=(v-p)/(q-p);
  const r=Math.round(ar+(br-ar)*t),g=Math.round(ag+(bg-ag)*t),b=Math.round(ab+(bb-ab)*t);
  const s=n=>n.toString(16).padStart(2,"0");
  return "#"+s(r)+s(g)+s(b);
}
export function addStock(slug, yesNo, amount, totalCost) {
  let stocks = getStocks();

  const idx = stocks.findIndex(s => s.slug === slug && s.yesNo === yesNo);
  if (idx !== -1) {
    stocks[idx].amount += amount;
    stocks[idx].totalCost += totalCost;
  } else {
    stocks.push({
      slug,
      yesNo,
      amount: amount,
      totalCost: totalCost,
      date: new Date().toISOString()
    });
  }

  setStocks(stocks);
}
export const user = $state({
  balance: null
});