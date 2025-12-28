<script>
  import {onMount} from "svelte";
  import {removeStock, getStockAmount, addStock, user, updateTutorialPhase} from '$lib/index.svelte.js';
  let mode = $state("BUY");
  let yesNo = $state("YES");
  let {market, yesPrice, noPrice} = $props();
  let amount = $state(1);
  import toast, { Toaster } from 'svelte-french-toast';
  function formatCoinUSD(amount) {
    const usd = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);

    // Replace the first currency symbol occurrence
    return usd.replace(/^\$/, '') +  " 🪙";
  }
  $effect(() => {
    if(typeof amount === 'number'){
      amount = Math.round(amount);
    }
  });
  $effect(() => {
    if(stockOwnedNo > 0){
      yesNo = "NO";
    } else if(stockOwnedYes > 0){
      yesNo = "YES";
    }
  });
  function buy(){
    if(market.slug === "monomarket-tutorial"){
      if(yesNo === "YES"){
        user.tutorialPhase = 3;
        updateTutorialPhase();
      }else{
        toast.error("Please buy a 'Yes' share to continue the tutorial. Select the 'Yes' tab above",{
          position: "bottom-right"
        } );
        return;
      }
    }
    user.balance -= (yesNo === "YES" ? yesPrice * amount : noPrice * amount);
    localStorage.setItem("balance", user.balance);
    addStock(market.slug, yesNo, amount, (yesNo === "YES" ? yesPrice * amount : noPrice * amount));
    toast.success(`Bought ${amount} ${yesNo.toLowerCase()} share(s) for ${formatCoinUSD(yesNo === "YES" ? yesPrice * amount : noPrice * amount)}`,{
      position: "bottom-right"
    } );
  }
  function sell(){
    if(market.slug === "monomarket-tutorial"){
      toast.error("Selling your tutorial shares is not allowed as they are important for the remainder of the tutorial.",{
        position: "bottom-right"
      } );
      return;
    }
    user.balance += (yesNo === "YES" ? yesPrice * amount : noPrice * amount);
    localStorage.setItem("balance", user.balance);
    removeStock(market.slug, yesNo, amount);
    toast.success(`Sold ${amount} ${lowercaseAllExceptFirst(yesNo)} share(s) for ${formatCoinUSD(yesNo === "YES" ? yesPrice * amount : noPrice * amount)}`,{
      position: "bottom-right"
    } );
  }
  function lowercaseAllExceptFirst(str) {
    if (typeof str !== 'string') return '';
    if (str.length === 0) return '';
    if (str.length === 1) return str;
    return str[0] + str.slice(1).toLowerCase();
  }
  let stockOwnedYes = $state(0);
  let stockOwnedNo = $state(0);
  let stockOwned = $derived(yesNo === "YES" ? stockOwnedYes : stockOwnedNo);
  let stockOwnedTotal = $derived(stockOwnedYes + stockOwnedNo);
  onMount(()=>{
    $effect(() => {
      stockOwnedYes = getStockAmount(market.slug, "YES", user.stocks);
      stockOwnedNo = getStockAmount(market.slug, "NO", user.stocks);
    })
    const urlParams = new URLSearchParams(window.location.search);
    mode = urlParams.get('mode') === "SELL" ? "SELL" : "BUY";
    yesNo = urlParams.get('yesNo') === "NO" ? "NO" : "YES";
  })
  function error(msg){
    toast.error(msg,{
      position: "bottom-right"
    } );
  }
</script>

<style>
  main{
      width: 200px;
      box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, oklab(0 0 0 / 0.04) 0px 8px 16px 0px;
      border-radius: 10px;
      outline: 1px #e7e8ea solid;
  }
  #modeSelector {
      display: flex;
      gap: 10px;
      font-size: 20px;
      padding: 10px;
      color: gray;
      font-weight: 550;
  }
  #modeSelector p{
      cursor: pointer;
  }
  .activated{
      color: black;
  }
  hr{
      border: none;
      margin: 0;
      padding: 0;
      height: 1px;
      background-color: #e7e8ea;
  }
  section{
      padding: 10px;
  }
  main{
      width: 325px;
  }
  #yesNoMenu{
      display: flex;
      gap: 5px;
      justify-content: space-between;
  }
  .yesActivated{
      background: #30a159;
  }
  .noActivated{
      background: #e23a39;
  }
  .deactivated{
      background: #eeeeee !important;
  }
  .yesActivated .name{
      color: #c5e4ce;
  }
  .noActivated .name{
      color: #f8c5c4;
  }
  .deactivated .name{
      color: black;
  }
  .deactivated .price{
      color: #8d8d8d;
  }
  .yesActivated .price{
      color: white;
  }
  .noActivated .price{
      color: white;
  }
  button:active {
      transform: scale(0.95);
  }
  .yesNo{
      height: 50px;
      width: 100%;
      display: flex;
      border-radius: 10px;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      gap: 10px;
  }
  #explanation{
      font-size: 13px;
      color: gray;
      margin-top: 10px;
  }
  #shareInput{
      margin-top: 15px;
      display: flex;
      flex-direction: row;
      gap: 5px;
      justify-content: space-between;
  }
  input{
      border: none;
      outline: none;
      text-align: right;
      font-size: 40px;
      font-weight: bolder;
      width: 200px;
  }
  h2{
      font-weight: normal;
  }
  .stat{
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      align-items: center;
  }
  .number{
      font-weight: bold;
      font-size: 16px;
  }
  button{
      margin-top: 16px;
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
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
  }
  input[type=number] {
      -moz-appearance:textfield;
  }
  span{
      font-weight: normal;
  }
  .noSell{
      cursor: not-allowed !important;
      opacity: 0.3;
  }
  .disallowed{
      cursor: not-allowed !important;
      opacity: 0.5;
      background: gray;
      color: white;
  }
  .quickadd{
      padding: 5px 10px;
      border: 1px rgb(230, 232, 234) solid;
      border-radius: 8px;
      cursor: pointer;
      user-select: none;

  }
  .quickadds{
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 10px;
  }

  /* Tablet breakpoint */
  @media (max-width: 1270px) {
      main {
          width: 70%;
          display: block;
          margin: 0 auto;
      }
  }

  /* Mobile breakpoint */
  @media (max-width: 600px) {
      main {
          width: 100%;
      }
      .yesNo {
          width: 48%;
          height: 45px;
      }
      input {
          width: 100%;
          font-size: 32px;
      }
      #shareInput {
          flex-wrap: wrap;
      }
      button {
          font-size: 14px;
          height: 45px;
      }
      .stat {
          font-size: 14px;
          flex-wrap: wrap;
          gap: 5px;
      }
      #explanation {
          font-size: 12px;
      }
      .quickadd {
          padding: 4px 8px;
          font-size: 14px;
      }
  }
</style>
<main>
  <div id="modeSelector">
    <p class={mode === "BUY" ? "activated" : ""} onclick={()=>{mode="BUY"}}>Buy</p>
    <p class='{mode === "SELL" ? "activated" : ""} {stockOwnedTotal === 0 ? "noSell" : ""}' title={stockOwnedTotal === 0 ? "You own no shares to sell" : ""} onclick={()=>{if(stockOwnedTotal>0){mode="SELL"}else{error("You own no shares you could sell")}}}>Sell</p>
  </div>
  <hr>
  <section id="buyMenu">
    {#if mode === "BUY"}
      <div id="yesNoMenu">
        <div id="yes" class='yesNo {yesNo === "NO" ? "deactivated" : "yesActivated"} {stockOwnedNo !== 0 ? "disallowed" : ""} ' title={stockOwnedNo !== 0 ? "Sell your No shares first" : ""} onclick={()=>{if(stockOwnedNo === 0){yesNo="YES"}else{error("You need to sell your 'Yes' shares first as you can't hold both yes and no shares at the same time")}}}>
          <p class="name">Yes</p>
          <p class="price">{yesPrice} 🪙</p>
        </div>
        <div id="no" class='yesNo {yesNo === "YES" ? "deactivated" : "noActivated"}  {stockOwnedYes !== 0 ? "disallowed" : ""}' title={stockOwnedYes !== 0 ? "Sell your Yes shares first" : ""} onclick={()=>{if(stockOwnedYes === 0){yesNo="NO"}else{error("You need to sell your 'Yes' shares first as you can't hold both yes and no shares at the same time")}}}>
          <p class="name">No</p>
          <p class="price">{noPrice} 🪙</p>
        </div>
      </div>
      <p id="explanation">ℹ You will receive 100 🪙 for each share if you predict correctly. You can sell your shares at anytime at current market price.</p>
    {/if}

    <div id="shareInput">
      <h2>Shares</h2>
      <input inputmode="numeric" pattern="[0-9]*" step="1" autofocus type="number" min="1" bind:value={amount} />
    </div>
    <div class="quickadds">
      <div class="quickadd" onclick={()=>{amount+=1}}>+1</div>
      <div class="quickadd" onclick={()=>{amount+=5}}>+5</div>
      <div class="quickadd" onclick={()=>{amount+=10}}>+10</div>
      {#if mode === "SELL"}
        <div class="quickadd" onclick={()=>{amount=stockOwnedTotal}}>All</div>
      {/if}
    </div>
    <hr style="margin-top: 15px; margin-bottom: 15px;" />
    {#if mode === "BUY"}
      <div class="stat">
        <p><b>You currently own:</b></p>
        <p  class="number" style="color: black">{stockOwned} <span>Share(s)</span></p>
      </div>

      <div class="stat">
        <p><b>Cost:</b> <b>{amount}</b> Share(s) * {yesNo === "YES" ? yesPrice : noPrice} 🪙</p>
        {#if yesNo === "YES"}
            <p  class="number" style="color: #e23a39">-{formatCoinUSD(yesPrice * amount)}</p>
        {:else}
            <p  class="number" style="color: #e23a39">-{formatCoinUSD(noPrice * amount)}</p>
        {/if}
      </div>
      <div class="stat">
        <p><b>Potential win:</b></p>
        <p class="number" style="color:#30a159">+{formatCoinUSD(amount * 100)}</p>
      </div>
      {#if user.balance >= (yesNo === "YES" ? yesPrice * amount : noPrice * amount) }
        <button onclick={buy}>
          Buy {amount} {lowercaseAllExceptFirst(yesNo)} share(s) for {yesNo === "YES" ? formatCoinUSD(yesPrice * amount) : formatCoinUSD(noPrice * amount)}
        </button>
      {:else}
        <button style="background: gray; cursor: not-allowed;" onclick={()=>{error("Insufficient balance to complete purchase")}}>
          You need {formatCoinUSD((yesNo === "YES" ? yesPrice * amount : noPrice * amount) - user.balance)} more
        </button>
      {/if}
    {:else}
      <div class="stat">
        <p><b>You currently own:</b></p>
        <p  class="number" style="color: black">{stockOwned} <span>Share(s)</span></p>
      </div>
      <div class="stat">
        <p><b>You'll sell:</b></p>
        <p  class="number" style="color: #e23a39">-{amount} <span>Share(s)</span></p>
      </div>
      <div class="stat">
        <p><b>Shares remaining:</b></p>
        <p  class="number" style="color: black">{stockOwned - amount} <span>Share(s)</span></p>
      </div>
      <div class="stat">
        <p><b>Payout:</b> <b>{amount}</b> Share(s) * {yesNo === "YES" ? yesPrice : noPrice} 🪙</p>
        {#if yesNo === "YES"}
          <p  class="number" style="color: #30a159">+{formatCoinUSD(yesPrice * amount)}</p>
        {:else}
          <p  class="number" style="color: #30a159">+{formatCoinUSD(noPrice * amount)}</p>
        {/if}
      </div>

      {#if stockOwned >= amount }
        <button onclick={sell}>
          Sell {amount} {lowercaseAllExceptFirst(yesNo)} share(s) for {yesNo === "YES" ? formatCoinUSD(yesPrice * amount) : formatCoinUSD(noPrice * amount)}
        </button>
      {:else if stockOwned > 0}
        <button style="background: gray; cursor: not-allowed;" onclick={()=>{error("You can't sell more shares than you own")}}>
          You only have {stockOwned} {lowercaseAllExceptFirst(yesNo)} share(s)
        </button>
      {:else}
        <button style="background: gray; cursor: not-allowed;">
          You own no {lowercaseAllExceptFirst(yesNo)} share(s)
        </button>
      {/if}
    {/if}
  </section>
</main>