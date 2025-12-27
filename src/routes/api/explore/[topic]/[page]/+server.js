import { json } from '@sveltejs/kit';

export async function GET({params}) {
  let req;
  const size = 300
  if(parseFloat(params.topic) === 0){
    req = await fetch("https://gamma-api.polymarket.com/markets?order=volume24hr&ascending=false&closed=false&limit=" + size + "&offset=" + size * (params.page -1))
  }else{
    req = await fetch("https://gamma-api.polymarket.com/markets?order=volume24hr&ascending=false&closed=false&limit=" + size + "&offset=" + size * (params.page -1) + "&tag_id=" + params.topic)
  }
  let res = await req.json();
  return json(res);
}