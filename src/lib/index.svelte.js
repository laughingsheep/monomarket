/*export function getStocks(){
  if(!localStorage.getItem('stocks')){
    localStorage.setItem('stocks', JSON.stringify([]));
  }
  return JSON.parse(localStorage.getItem('stocks'));
}*/
export function saveStocks(){
  localStorage.setItem('stocks', JSON.stringify(user.stocks));
}
export function calculateSharePrice(usdPrice){
  let coinPrice = Math.round(usdPrice * 100);
  if(coinPrice === 100) coinPrice = 99;
  if(coinPrice === 0) coinPrice = 1;
  return coinPrice;
}
export function getStockAmount(slug, yesNo){
  const stock = user.stocks.find(s => s.slug === slug && s.yesNo === yesNo);
  return stock ? stock.amount : 0;
}
export function removeStock(slug, yesNo, amount){
  let stocks = user.stocks;
  const idx = stocks.findIndex(s => s.slug === slug && s.yesNo === yesNo);
  if (idx !== -1) {
    stocks[idx].amount -= amount;
    if (stocks[idx].amount <= 0) {
      stocks.splice(idx, 1);
    }
    user.stocks = stocks;
    saveStocks();
  }
}
export function removeAllStock(slug){
  user.stocks = user.stocks.filter(s => s.slug !== slug);
  saveStocks();
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
  const idx = user.stocks.findIndex(s => s.slug === slug && s.yesNo === yesNo);
  if (idx !== -1) {
    user.stocks[idx].amount += amount;
    user.stocks[idx].totalCost += totalCost;
  } else {
    user.stocks.push({
      slug,
      yesNo,
      amount: amount,
      totalCost: totalCost,
      date: new Date().toISOString()
    });
  }
  saveStocks();
}
export function updateTutorialPhase(){
  localStorage.setItem("tutorialPhase", user.tutorialPhase);
}
export const user = $state({
  balance: null,
  stocks: [],
  tutorialPhase: 10
});

export const tutorialMarket = {
  "question": "Will you enjoy using Monomarket?",
  "slug": "monomarket-tutorial",
  "endDate": new Date(),
  "liquidity": "5211906.61263",
  "description": "Welcome to your first Monomarket question!\nThis is a fake question just for the tutorial. This market will resolve to Yes, because I just know you will enjoy using Monomarket!",
  "outcomes": "[\"Yes\", \"No\"]",
  "outcomePrices": "[\"0.80\", \"0.20\"]",
  "volume": "8500855.780657",
  "closed": false,
  "volumeNum": 8500855.780657,
  "clobTokenIds": "[\"27695328018487126865140678987084292751433108128829892791442349095512543527405\", \"66929654862706119595556457864718719645706521900611031775760907439327687408012\"]",
}