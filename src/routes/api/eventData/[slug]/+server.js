import {error, json} from '@sveltejs/kit';

export async function GET({params}) {
  let req = await fetch("https://gamma-api.polymarket.com/markets/slug/" + params.slug)
  if(!req.ok) {
    error(404);
  }
  let res = await req.json();
  return json(res);
}