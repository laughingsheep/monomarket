<script>
  import {updateTutorialPhase, user} from "$lib/index.svelte.js";
import Nav from "../Nav.svelte";
import Prediction from "./Prediction.svelte";
  import {onMount} from "svelte";
  import Last from "$lib/tutorial/Last.svelte";
onMount(()=>{
  if(user.tutorialPhase === 4){
    user.tutorialPhase = 5;
    updateTutorialPhase();
  }
})
</script>

<Nav/>
<svelte:head>
  <title>Your Predictions | Monomarket</title>
</svelte:head>
<main>
  <section>
    <h1>My Predictions</h1>
    {#if user.stocks.length === 0}
      <p>You currently have no open predictions. Click on explore to bet on new questions!</p>
    {/if}
    <div class="stocks">
      {#each user.stocks as stock}
        <Prediction {stock}/>
      {/each}
      {#each Array.from({ length: 4 - user.stocks.length % 4 }) as blank}
        <div style="width: 300px;height: 210px;"></div>
      {/each}
    </div>
  </section>
</main>
{#if [6, 7].includes(user.tutorialPhase)}
  <Last/>
{/if}
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
