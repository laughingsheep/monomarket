<script>
  import PopOver from "$lib/tutorial/PopOver.svelte";

  let { stock } = $props();

  import {calculateSharePrice, colorForValue, formatCoins, removeAllStock, updateTutorialPhase, user} from "$lib/index.svelte.js";
  import Last from "$lib/tutorial/Last.svelte";
  const longDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  let yesPrice = $state();
  let noPrice = $state();
  let chanceColor = $state();
  let currentPrice = $state();
  let hasWon = $state();
  async function loadMarket() {
    const res = await fetch('/api/eventData/' + stock.slug);
    if (!res.ok) throw new Error('Failed to load posts');
    let market2 = await res.json();
    let prices = JSON.parse(market2["outcomePrices"]).map(Number);
    yesPrice = calculateSharePrice(prices[0]);
    noPrice = calculateSharePrice(prices[1]);
    currentPrice = stock.yesNo === "YES" ? yesPrice : noPrice;
    chanceColor = colorForValue(currentPrice);
    hasWon = (stock.yesNo === "YES" && yesPrice === 99) || (stock.yesNo === "NO" && noPrice === 99)
    if(market2.slug === "monomarket-tutorial"){
      hasWon = true;
      yesPrice = 99;
      market2.closed = true;
    }
    return market2;
  }
  const market = loadMarket();
  function claimWinnings(){
    user.balance += stock.amount * 100;
    localStorage.setItem("balance", user.balance);
    if(user.tutorialPhase === 5){
      user.tutorialPhase = 6;
      updateTutorialPhase();
    }
  }
  function redirect(){
    if(!market.closed){
      location.href = '/event/' + stock.slug + "?mode=SELL&yesNo=" + stock.yesNo;
    }
  }
  let main = $state();
</script>

{#await market}

{:then market}
  <main bind:this={main}>
    <div id="top" onclick={redirect}>
      <div style="display: flex; flex-direction:column;">
        <img src={market["icon"]  || "/noImage.png" } alt="Market icon" />
      </div>
      <h1>
        {#if market.closed}
          {#if hasWon}
            <h6 class="won">WON</h6>
          {:else}
            <h6 class="lose">LOST</h6>
          {/if}
        {:else}
          {#if stock.yesNo === "YES"}
            <h6>YES</h6>
          {:else}
            <h6 id="no">NO</h6>
          {/if}
        {/if}
        {market["question"]}
      </h1>
      {#if market.closed}
        <div style="--color: {chanceColor}">
          {#if yesPrice === 99}
            <h2>YES</h2>
          {:else}
            <h2>NO</h2>
          {/if}
          <h3>won</h3>
        </div>
      {:else}
        <div style="--color: {chanceColor}">
          <h2>{yesPrice}%</h2>
          <h3>chance</h3>
        </div>
      {/if}
    </div>
    {#if !market.closed}
      <div id="bottom" style="--chance: {yesPrice}%">
        <div class="stat">
          <h4>{stock.amount}</h4>
          <h5>Shares</h5>
        </div>
        <div class="stat">
          <h4>{stock.amount * currentPrice} <span>🪙</span></h4>
          <h5>Value</h5>
        </div>
        <div class="stat">
          {#if stock.amount * currentPrice - stock.totalCost > 0}
            <h4 style="color: #30A159;">{stock.amount * currentPrice - stock.totalCost} <span>🪙</span></h4>
          {:else if stock.amount * currentPrice - stock.totalCost < 0}
            <h4 style="color: #E23A39;">{stock.amount * currentPrice - stock.totalCost} <span>🪙</span></h4>
          {:else}
            <h4>{stock.amount * currentPrice - stock.totalCost} <span>🪙</span></h4>
          {/if}
          <h5>Profit</h5>
        </div>
        {#if market.endDate}
          <div class="stat">
            <h4>{longDate.format(new Date(market.endDate))}</h4>
            <h5>End Date</h5>
          </div>
        {:else}
          <div class="stat">
            <h4>Overdue</h4>
            <h5>on Judgment</h5>
          </div>
        {/if}
      </div>
      <div id="actions" style="--chance: {yesPrice}%">
        <button id="yes" onclick={location.href = '/event/' + market.slug + "?mode=BUY"} >Buy more</button>
        <button id="no" onclick={location.href = '/event/' + market.slug + "?mode=SELL"}>Sell share(s)</button>
      </div>
    {:else}
      {#if hasWon}
        <button onclick={()=>{claimWinnings();removeAllStock(stock.slug)}}>Claim {formatCoins(stock.amount * 100)} (+{formatCoins(stock.amount * 100 - stock.totalCost)})</button>
      {:else}
        <button id="hide" onclick={()=>{removeAllStock(stock.slug)}}>Hide</button>
      {/if}
    {/if}
  </main>
  {#if market.slug === "monomarket-tutorial" && user.tutorialPhase === 5}
    <PopOver highlighted={main} />
  {/if}

{/await}
<style>
    button:active {
        transform: scale(0.95);
    }
    button{
          width: 100%;
          height: 50px;
          border-radius: 10px;
          color: white;
          border: none;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          background: #1452F0;
    }
    .won{
          background: #c7b222 !important;
          color: #eeff00 !important;
    }
    .lose{
        background: black !important;
        color: white !important;
    }
    h6{
        font-size:16px;
        border-radius: 5px;
        background: #e6f7ea;
        color: #2fa159;
        width: 50px;
        height: 20px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }
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
    span{
        font-size: 14px;
    }
    h1{
        font-size: 16px;
        font-weight: 600;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        overflow: hidden;
        display: flex;
        gap: 10px;
        flex-direction: column;
        flex-wrap: wrap;           /* hide overflow */
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
        align-items: flex-end;
    }
    #actions{
        display: flex;
        gap: 20px;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
    }
    h4{
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
    }
    h5{
        font-size: 14px;
        color: gray;
        font-weight: normal;
    }
    #yes{
        color: white;
        background: #2fa159;
    }
    #no{
        color: white;
        background: #e23a39;
    }
    #hide{
        background: #eeeeee;
        color: black;
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
        height: 210px;
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
        flex-shrink: 0;
    }

    /* Mobile breakpoint */
    @media (max-width: 600px) {
        main {
            width: 100%;
            height: auto;
            min-height: 210px;
        }
        #bottom {
            flex-wrap: wrap;
            gap: 10px;
        }
        .stat {
            min-width: 45%;
        }
        #actions {
            flex-direction: column;
            gap: 10px;
        }
        #actions button {
            width: 100%;
        }
        h4 {
            font-size: 16px;
        }
        h5 {
            font-size: 12px;
        }
    }
</style>