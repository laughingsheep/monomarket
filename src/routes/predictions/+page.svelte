<script>
import { user } from "$lib/index.svelte.js";
import Nav from "../Nav.svelte";
import Prediction from "./Prediction.svelte";
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
        justify-content: center;
    }
    section {
        width: 100%;
        max-width: 1400px;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .stocks {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
    }

    .stocks > :global(*) {
        flex-grow: 1;
        min-width: 300px;
    }
</style>
