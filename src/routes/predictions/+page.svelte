<script>
import { getStocks } from "$lib/index.svelte.js";
import Nav from "../Nav.svelte";
import Prediction from "./Prediction.svelte";
import { onMount } from "svelte";
let stocks = $state([]);
onMount(()=>{
  stocks = getStocks()
});
</script>
<Nav/>

<main>
  <section>
    <h1>My Predictions</h1>
    <div class="stocks">
      {#each stocks as stock}
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
