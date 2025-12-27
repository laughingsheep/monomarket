<script>
  import {onMount} from "svelte";

  let { market } = $props();
  import { calculateSharePrice } from '$lib/index.svelte.js';
  let prices = JSON.parse(market["outcomePrices"]).map(Number);
  let yesPrice = calculateSharePrice(prices[0]);
  let noPrice = calculateSharePrice(prices[1]);
  import { colorForValue, user } from '$lib/index.svelte.js';
  let chanceColor = colorForValue(yesPrice);

  import PopOver from "$lib/tutorial/PopOver.svelte";
  let main = $state();
</script>


<main bind:this={main}>
  <div id="top" onclick={location.href = '/event/' + market.slug}>
    <img src={market["icon"] || "/noImage.png"} alt="Market icon" />
    <h1>{market["question"]}</h1>
    <div style="--color: {chanceColor}">
      <h2>{yesPrice}%</h2>
      <h3>chance</h3>
    </div>
  </div>
  <div id="bottom" style="--chance: {yesPrice}%">
    <button id="yes" onclick={location.href = '/event/' + market.slug} >Yes - {yesPrice}%</button>
    <button id="no" onclick={location.href = '/event/' + market.slug + "?yesNo=NO"}>No - {noPrice}%</button>
  </div>
</main>
{#if market.slug === "monomarket-tutorial" && user.tutorialPhase === 1}
  <PopOver highlighted={main} />
{/if}
<style>
    button{
        cursor: pointer;
    }
    #top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
    }
    #top h2{
        color: var(--color);
        filter: brightness(0.75);
    }
    #top h3{
        color: #5b5757;
        font-size: 10px;
    }
    div{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    h1{
        font-size: 16px;
        font-weight: 600;
        display: -webkit-box;         /* flex-like box model for clamping */
        -webkit-box-orient: vertical; /* vertical layout */
        -webkit-line-clamp: 4;        /* number of lines */
        overflow: hidden;             /* hide overflow */
    }
    main{
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    #bottom{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    #yes{
        color: white;
        background: linear-gradient(to right, green 0, green var(--chance), #2fa159 var(--chance), #2fa159 100%);
    }
    #no{
        color: white;
        background: linear-gradient(to right, #e23a39 0, #e23a39 calc(100% - var(--chance)), #eb6e6e calc(100% - var(--chance)), #eb6e6e 100%);
    }
    #bottom button{
        height: 30px;
        width: 140px;
        outline: none;
        border: none;
        border-radius: 5px;

    }
    main{
        box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, oklab(0 0 0 / 0.04) 0px 8px 16px 0px;
        width: 300px;
        height: 120px;
        outline: 1px #e7e8ea solid;
        border-radius: 15px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    #top{
        display: flex;
        gap: 16px;
    }
    img{
        width: 50px;
        height: 50px;
        object-fit: cover;
        object-position: center;
        display: block;
        border-radius: 8px;
    }
</style>