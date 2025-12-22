<script>
  import {onMount} from "svelte";
  import { addStock, user, getStocks } from '$lib/index.svelte.js';
  let mode = $state("BUY");
  let yesNo = $state("YES");
  let {market, yesPrice, noPrice} = $props();
  let amount = $state(1);

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
  function buy(){
    user.balance -= (yesNo === "YES" ? yesPrice * amount : noPrice * amount);
    localStorage.setItem("balance", user.balance);
    addStock(market.slug, yesNo, amount, yesNo === "YES" ? yesPrice : noPrice);
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

  .yesNo{
      height: 50px;
      width: 150px;
      display: flex;
      border-radius: 10px;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      gap: 10px;
  }
  #explaination{
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
      font-size: 20px;
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
</style>
<main>
  <div id="modeSelector">
    <p class={mode === "BUY" ? "activated" : ""} onclick={mode="BUY"}>Buy</p>
    <p class={mode === "SELL" ? "activated" : ""} onclick={mode="SELL"}>Sell</p>
  </div>
  <hr>
  <section id="buyMenu">
    <div id="yesNoMenu">
      <div id="yes" class='yesNo {yesNo === "NO" ? "deactivated" : "yesActivated"}' onclick={yesNo="YES"}>
        <p class="name">Yes</p>
        <p class="price">{yesPrice} 🪙</p>
      </div>
      <div id="no" class='yesNo {yesNo === "YES" ? "deactivated" : "noActivated"}' onclick={yesNo="NO"}>
        <p class="name">No</p>
        <p class="price">{noPrice} 🪙</p>
      </div>
    </div>
    <p id="explaination">ℹ You will receive 100 🪙 for each share if you predict correctly. You can sell your shares at anytime at current market price.</p>

    <div id="shareInput">
      <h2>Shares</h2>
      <input inputmode="numeric" pattern="[0-9]*" step="1" autofocus type="number" min="1" bind:value={amount} />
    </div>
    <hr style="margin-top: 15px; margin-bottom: 15px;" />
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
        Buy {amount} for {yesNo === "YES" ? formatCoinUSD(yesPrice * amount) : formatCoinUSD(noPrice * amount)}
      </button>
    {:else}
      <button style="background: gray; cursor: not-allowed;">
        You need {formatCoinUSD((yesNo === "YES" ? yesPrice * amount : noPrice * amount) - user.balance)} more
      </button>
    {/if}
  </section>
</main>