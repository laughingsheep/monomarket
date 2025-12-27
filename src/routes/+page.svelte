<script>
  import { onMount } from "svelte";
  import MarketOverview from "$lib/MarketOverview.svelte";
  import Nav from "./Nav.svelte";
  import {Bitcoin, CircleDollarSign, Earth, GalleryVerticalEnd, Landmark, Monitor, Scale, Users} from 'lucide-svelte';
  import First from "$lib/tutorial/First.svelte";
  import {tutorialMarket} from "$lib/index.svelte.js";
  let markets = $state([]);
  let page = 1;
  let loading = false;
  let sentinel;

  async function loadMarkets(topicName) {
    if (loading) return;
    loading = true;
    let topics = {
      All: 0,
      Politics: 2,
      Tech: 1401,
      Finance: 120,
      Culture: 596,
      Economy: 100328,
      World: 101970,
      Crypto: 21,
    }
    const res = await fetch(`/api/explore/${topics[topicName]}/${page}`);
    if (!res.ok) {
      loading = false;
      return;
    }
    const data = await res.json();
    markets = [...markets, ...data];
    if(localStorage.getItem("tutorialPhase") == null && page === 1){
      isTutorial = true;
      markets = [tutorialMarket, ...markets];

    }
    page++;
    loading = false;
  }

  onMount(() => {
    loadMarkets("All");
    $effect(()=>{
      page = 1;
      markets = [];
      loadMarkets(topic);
    })
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMarkets(topic);
      },
      { rootMargin: "500px" }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  });
  let topic = $state("All");
  let isTutorial = $state(false);
</script>

{#if isTutorial}
  <First/>
{/if}
<Nav />
<svelte:head>
  <title>Monomarket | Free Prediction Market</title>
</svelte:head>
<main>
  <div id="topics">
    <p onclick={() => (topic = 'All')} class:selected={topic === 'All'}><GalleryVerticalEnd />All</p>
    <p onclick={() => (topic = 'Politics')} class:selected={topic === 'Politics'}> <Scale />Politics</p>
    <p onclick={() => (topic = 'Tech')} class:selected={topic === 'Tech'}><Monitor />Tech</p>
    <p onclick={() => (topic = 'Finance')} class:selected={topic === 'Finance'}><Landmark />Finance</p>
    <p onclick={() => (topic = 'Culture')} class:selected={topic === 'Culture'}><Users />Culture</p>
    <p onclick={() => (topic = 'Economy')} class:selected={topic === 'Economy'}><CircleDollarSign />Economy</p>
    <p onclick={() => (topic = 'World')} class:selected={topic === 'World'}><Earth />Worldwide</p>
    <p onclick={() => (topic = 'Crypto')} class:selected={topic === 'Crypto'}><Bitcoin />Crypto</p>
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
    .selected{
        color: #2e5cff !important;
    }
    #topics p{
        gap: 5px;
        display: flex;
        align-items: center;
        padding: 5px 0px;
        border-radius: 8px;
        font-size: 20px;
        user-select: none;
        cursor: pointer;
    }
    #topics{
        display: flex;
        gap: 30px;
        align-items: center;

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
