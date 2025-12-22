<script>
  import { user } from "$lib/index.svelte.js";
  import {onMount} from "svelte";

  function formatCoinUSD(amount) {
    const usd = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);

    // Replace the first currency symbol occurrence
    return usd.replace(/^\$/, '') +  " 🪙";
  }
  let loc = $state();
  onMount(()=>{
    if(!localStorage.getItem("balance")){
      user.balance = 1000;
    }
    loc = location.pathname;
    user.balance = parseInt(localStorage.getItem("balance"));
    localStorage.setItem("balance", user.balance);
  });
</script>

<nav>
  <main>
    <div id="links">
      <img id="logo" src="/logo.png" alt="Monomarket" on:click={location.href="/"}/>
      <a href="/" class={loc === "/" ? "active" : ""}>Explore</a>
      <a href="/predictions" class={loc === "/predictions" ? "active" : ""}>My Predictions</a>
    </div>
    <div>
      <b>{formatCoinUSD(user.balance)}</b>
    </div>
  </main>
</nav>

<style>
    .active{
        color: #2e5cff;
        font-weight: bold;
    }
    #links{
        display: flex;
        align-items: center;
        gap: 20px;
    }
    a{
        text-decoration: none;
        color: black;
        font-weight: 500;
        font-size: 16px;
    }
  img{
      height: 60px;
      cursor: pointer;
  }
  b{
      font-size: 20px;
  }
  nav{
      padding-left: 20px;
      padding-right: 20px;
      margin-bottom: 20px;
      padding-top: 16px;
      padding-bottom: 16px;
      border-bottom: 1px #e7e8ea solid;
      display: flex;
      justify-content: center;
  }
  main{
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 1400px;
  }
</style>