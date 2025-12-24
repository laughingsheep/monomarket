<script>
  import { onMount } from "svelte";
  import MarketOverview from "$lib/MarketOverview.svelte";
  import Nav from "./Nav.svelte";

  let markets = [];
  let page = 1;
  let loading = false;
  let sentinel;

  async function loadMarkets() {
    if (loading) return;
    loading = true;
    const res = await fetch(`/api/explore/${page}`);
    if (!res.ok) {
      loading = false;
      return;
    }
    const data = await res.json();
    markets = [...markets, ...data];
    page++;
    loading = false;
  }

  onMount(() => {
    loadMarkets();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMarkets();
      },
      { rootMargin: "500px" }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  });
</script>

<Nav />
<svelte:head>
  <title>Monomarket | Free Prediction Market</title>
</svelte:head>
<main>
  <div id="topics">
    <p>All</p>
    <p>Politics</p>
    <p>Tech</p>
    <p>Finance</p>
    <p>Culture</p>
    <p>Economy</p>
    <p>World</p>
    <p>Crypto</p>
  </div>
  <section>
    {#each markets as market}
      <MarketOverview {market} />
    {/each}
  </section>

  {#if loading}
    <p class="loading">Loading more…</p>
  {/if}

  <div bind:this={sentinel}></div>
</main>

<style>
    #topics{
        display: flex;
        gap: 15px;
        overflow-x: auto;
        padding: 10px 0;
        margin-bottom: 10px;
        width: 100%;
        max-width: 1400px;
        padding: 10px 20px;
        box-sizing: border-box;
    }
    main {
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    section {
        width: 100%;
        max-width: 1400px;
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        padding: 0 20px;
        box-sizing: border-box;
    }

    section > :global(*) {
        flex-grow: 1;
        min-width: 300px;
    }

    .loading {
        padding: 20px;
        opacity: 0.6;
    }
</style>
