import { error } from '@sveltejs/kit';

export async function load({ params }) {

  let req = await fetch("https://gamma-api.polymarket.com/markets/slug/" + params.slug)
  if(!req.ok) {
    error(404);
  }
  let market = await req.json();
  let clobYesId = JSON.parse(market.clobTokenIds)[0]
  let req2 = await fetch("https://clob.polymarket.com/prices-history?fidelity=60&interval=max&market=" + clobYesId)
  if(!req2.ok) {
    error(500);
  }
  let res = await req2.json();
  let priceHistory = res["history"];
  return {
    market,
    priceHistory
  };
}