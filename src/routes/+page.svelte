<script>
  import { onMount } from "svelte";
  import MarketOverview from "$lib/MarketOverview.svelte";
  import Nav from "./Nav.svelte";
  import {Bitcoin, CircleDollarSign, Earth, GalleryVerticalEnd, Landmark, Monitor, Scale, Users} from 'lucide-svelte';
  import First from "$lib/tutorial/First.svelte";
  import {tutorialMarket, user} from "$lib/index.svelte.js";
  let markets = $state([]);
  let page = 1;
  let loading = $state(false);
  let sentinel;
  let seenIds = new Set();
  async function loadMarkets(topicName) {
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
    let data = await res.json();
    data = data.filter(m => JSON.parse(m.outcomes)[0] === 'Yes' && JSON.parse(m.outcomes)[1] === 'No');
    data = data.filter(m => JSON.parse(m.outcomePrices)[0] < 0.985)
    data = data.filter(m => JSON.parse(m.outcomePrices)[1] < 0.985)
    const filteredData = data.filter(item => {
      if (!Array.isArray(item.events)) return true;
      for (const event of item.events) {
        if (seenIds.has(event.id)) {
          return false;
        }
      }
      for (const event of item.events) {
        seenIds.add(event.id);
      }

      return true;
    });
    data = filteredData;

    markets = [...markets, ...data];
    if([0, 1, 2, 3].includes(user.tutorialPhase) && page === 1){
      markets = [tutorialMarket, ...markets];
      if(user.tutorialPhase === 0){
        isTutorial = true;
      }
    }
    page++;
    loading = false;
  }

  onMount(() => {
    loadMarkets("All");
    $effect(()=>{
      page = 1;
      markets = [];
      seenIds = new Set();
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
    <p class="loading">Loading…</p>
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

    /* Tablet breakpoint */
    @media (max-width: 900px) {
        #topics {
            gap: 20px;
        }
        #topics p {
            font-size: 16px;
        }
    }

    /* Mobile breakpoint */
    @media (max-width: 600px) {
        #topics {
            gap: 15px;
            padding: 10px 12px;
        }
        #topics p {
            font-size: 14px;
            white-space: nowrap;
        }
        section {
            padding: 0 12px;
            gap: 12px;
        }
        section > :global(*) {
            min-width: 100%;
        }
    }
</style>
