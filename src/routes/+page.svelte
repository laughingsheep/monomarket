<script>
  import MarketOverview from "./MarketOverview.svelte";
  import Nav from "./Nav.svelte";
  async function loadMarkets() {
    const res = await fetch('/explore');
    if (!res.ok) throw new Error('Failed to load posts');
    return res.json();
  }
  const markets = loadMarkets();
</script>
<Nav/>
<main>
  {#await markets}
    <p>Loading markets...</p>
  {:then markets}
    <section>
      {#each markets as market}
        <MarketOverview {market} />
      {/each}
    </section>
  {/await}
</main>
<style>
    main{
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
    }
  section {

      justify-content: center;
      max-width: 1400px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 20px;
  }
</style>
