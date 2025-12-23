import {error, json} from '@sveltejs/kit';

export async function GET({params}) {
  let req = await fetch(`https://gamma-api.polymarket.com/public-search?q=${params.term}&keep_closed_markets=0&page=${params.page}`)
  if(!req.ok) {
    error(404);
  }
  let res = await req.json();
  let events = res["events"]
  let markets = events.flatMap(e => e.markets || []);
  //market must have key "outcomePrices"
  markets = markets.filter(m => m.hasOwnProperty("outcomePrices"));
  markets = markets.filter(m => !m.closed);
  //sort by key "volume" descending
  markets.sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));
  return json(markets);
}