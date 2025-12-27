import {error, json} from '@sveltejs/kit';
import {tutorialMarket} from "$lib/index.svelte.js";

export async function GET({params}) {
  if(params.slug === "monomarket-tutorial"){
    let market = tutorialMarket;
    return json(market);
  }
  let req = await fetch("https://gamma-api.polymarket.com/markets/slug/" + params.slug)
  if(!req.ok) {
    error(404);
  }
  let res = await req.json();
  return json(res);
}