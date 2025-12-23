<script>
  import { onMount } from "svelte";
  import MarketOverview from "$lib/MarketOverview.svelte";
  import Nav from "../../Nav.svelte";
  let { data } = $props();
  let markets = $state([]);
  let page = 1;
  let loading = false;

  let sentinel;
  let searchTerm = $state("");
  async function loadMarkets() {
    if (loading) return;
    loading = true;
    searchTerm = decodeURI(location.pathname.split("/").at(-1))
    const res = await fetch(`/api/search/${searchTerm}/${page}`);
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
  <title>Search for {searchTerm} | Monomarket</title>
</svelte:head>
<main>
  {#if markets.length === 0 && !loading}
    <h2>No markets found for "{searchTerm}"</h2>
  {/if}
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
    main {
        width: 100vw;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    section {
        max-width: 1400px;
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
    }

    .loading {
        padding: 20px;
        opacity: 0.6;
    }
</style>
