import { json } from '@sveltejs/kit';

export async function GET() {
  let req = await fetch("https://gamma-api.polymarket.com/markets?order=volume&ascending=false&closed=false&limit=50")
  let res = await req.json();
  return json(res);
}