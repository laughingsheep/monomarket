import { error } from '@sveltejs/kit';
import {tutorialMarket} from "$lib/index.svelte.js";

export async function load({ params }) {
  if(params.slug === "monomarket-tutorial"){
    let market = tutorialMarket;
    return {
      market,
      priceHistory: [
        { p: 0.5, t: (Date.now() - 2*1000*7*60*60*24) / 1000 },
        { p: 0.6, t: (Date.now() - 1000*7*60*60*24) / 1000},
        { p: 0.8, t: (Date.now()) / 1000 },
      ]
    }
  }
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