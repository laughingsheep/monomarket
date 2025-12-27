<script>
  import Nav from "../../Nav.svelte";
  import TransactionWidget from "./TransactionWidget.svelte";
  import PriceHistory from "./PriceHistory.svelte";
  import {calculateSharePrice, updateTutorialPhase, user} from '$lib/index.svelte.js';
  import PopOver from "$lib/tutorial/PopOver.svelte";
  import {onMount} from "svelte";


  let { data } = $props();
  let market = data.market
  const longDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  let prices = JSON.parse(market["outcomePrices"]).map(Number);
  let yesPrice = calculateSharePrice(prices[0]);
  let noPrice = calculateSharePrice(prices[1]);
  function formatCoinUSD(amount) {
    const usd = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);

    // Replace the first currency symbol occurrence
    return usd.replace(/^\$/, '') +  " 🪙";
  }
  onMount(() => {
    if(user.tutorialPhase === 1){
      user.tutorialPhase = 2;
      updateTutorialPhase()
    }
    if(market.slug === "monomarket-tutorial" && user.tutorialPhase > 3){
      location.href = "/"
    }
    if(market.closed){
      location.href = "/";
    }
  })
  console.log(market.endDate)
  let main = $state();
</script>
<Nav/>
<svelte:head>
  <title>{market["question"]} | Monomarket</title>
</svelte:head>
<main>
  <section>
    <div class="split">
      <div>
        <div id="info">
          <img src={market["icon"]  || "/noImage.png" } alt="Market icon" />
          <h1>{market["question"]}</h1>
        </div>
        {#if market.endDate}
          <p id="small">{formatCoinUSD(market.volume * 100)} Vol. · Expected to end {longDate.format(new Date(market.endDate))}</p>
        {:else}
            <p id="small">{formatCoinUSD(market.volume * 100)} Vol. · Overdue on prediction judgment </p>
        {/if}
        <PriceHistory {yesPrice} priceHistory={data.priceHistory} />
        <div style="margin-top: 16px;">
          <h1>Rules</h1>
          <pre>{market.description}</pre>
        </div>
      </div>
      <div id="round" bind:this={main}>
        <TransactionWidget {market} {yesPrice} {noPrice}/>
      </div>
    </div>

  </section>
</main>
{#if market.slug === "monomarket-tutorial" && [2, 3].includes(user.tutorialPhase)}
  <PopOver highlighted={main} />
{/if}
<style>

    #round{
        border-radius: 10px;
        height: min-content;
    }
    pre{
        max-width: 1000px;
        text-wrap: auto;
    }
    .split{
        justify-content: space-between;
        display: flex;
    }
    main{
        padding: 0 20px;
    }
    #small{
        margin-top: 20px;
        color: gray;
    }
    #info{
        display: flex;
        align-items: center;
        gap: 20px;
    }
    main{
        display: flex;
        justify-content: center;
    }
    section{
        width: 1360px;
    }
    img{
        width: 64px;
        height: 64px;
        object-fit: cover;
        object-position: center;
        display: block;
        border-radius: 8px;
    }
    h1{
        font-size: 24px;
    }
</style>