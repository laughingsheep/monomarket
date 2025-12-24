<script>
import { user } from "$lib/index.svelte.js";
import Nav from "../Nav.svelte";
import Prediction from "./Prediction.svelte";
import { onMount } from "svelte";
</script>
<Nav/>
<svelte:head>
  <title>Your Predictions | Monomarket</title>
</svelte:head>
<main>
  <section>
    <h1>My Predictions</h1>
    {#if user.stocks.length === 0}
      <p>You have no predictions yet. Explore markets to make your first prediction!</p>
    {/if}
    <div class="stocks">
      {#each user.stocks as stock}
        <Prediction {stock}/>
      {/each}
    </div>
  </section>
</main>
<style>
    h1{
        margin: 16px 0;
    }
    main{
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .stocks {
        width: 1400px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 20px;
    }
</style>
