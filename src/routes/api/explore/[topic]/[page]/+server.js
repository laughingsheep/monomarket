import { json } from '@sveltejs/kit';

export async function GET({params}) {
  let req;
  if(parseFloat(params.topic) === 0){
    req = await fetch("https://gamma-api.polymarket.com/markets?order=volume24hr&ascending=false&closed=false&limit=50&offset=" + 50 * (params.page -1))
  }else{
    req = await fetch("https://gamma-api.polymarket.com/markets?order=volume24hr&ascending=false&closed=false&limit=50&offset=" + 50 * (params.page -1) + "&tag_id=" + params.topic)
  }
  let res = await req.json();
  return json(res);
}