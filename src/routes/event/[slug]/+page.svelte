<script>
  import Nav from "../../Nav.svelte";
  import TransactionWidget from "./TransactionWidget.svelte";
  import PriceHistory from "./PriceHistory.svelte";
  let { data } = $props();
  let market = data.market
  const longDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  let prices = JSON.parse(market["outcomePrices"]).map(Number);
  let yesPrice = Math.round(prices[0] * 100);
  let noPrice = Math.round(prices[1] * 100);
  function formatCoinUSD(amount) {
    const usd = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);

    // Replace the first currency symbol occurrence
    return usd.replace(/^\$/, '') +  " 🪙";
  }

</script>
<Nav/>
<main>
  <section>
    <div class="split">
      <div>
        <div id="info">
          <img src={market["icon"]} alt="Market icon" />
          <h1>{market["question"]}</h1>
        </div>
        <p id="small">{formatCoinUSD(market.volume * 100)} Vol. · Ends {longDate.format(new Date(market.endDate))} at latest</p>
        <PriceHistory {yesPrice} priceHistory={data.priceHistory}/>
      </div>
      <div>
        <TransactionWidget {market} {yesPrice} {noPrice}/>
      </div>
    </div>

  </section>
</main>

<style>
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
        width: 1400px;
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