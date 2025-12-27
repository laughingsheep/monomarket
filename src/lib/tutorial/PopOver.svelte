<script>
  import {onDestroy, onMount} from "svelte";

  let { highlighted } = $props();
  let tutorial = $state();
  import { user, updateTutorialPhase } from "$lib/index.svelte.js";
  import {autoUpdate, computePosition, offset} from '@floating-ui/dom';
  function updatePos(){
    let placement = "right";
    let offsetNumber = 200;
    if(user.tutorialPhase === 2){
      placement = "left-start";
      offsetNumber = -100;
    }
    if(user.tutorialPhase === 3){
      placement = "left-start";
      offsetNumber = -100;
    }
    if(user.tutorialPhase === 4){
      placement = "bottom";
      offsetNumber = 70;
    }
    if(user.tutorialPhase === 5){
      placement = "right-start";
      offsetNumber = 200;
    }
    computePosition(highlighted, tutorial, {
      placement: placement,
      middleware: [offset(offsetNumber)],
    }).then(({x, y}) => {
      Object.assign(tutorial.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  }
  onDestroy(()=>{
    document.removeEventListener("click", outsideClickListener);
    if(highlighted === undefined) return;
    highlighted.style.boxShadow = "";
    highlighted.style.zIndex = "";

  })

  let outsideClickListener = null;
  onMount(()=>{
    Object.assign(highlighted.style, {
      "box-shadow": "0 0 0 9999px rgba(0,0,0,0.65)",
      "z-index": 1
    })
    autoUpdate(
      highlighted,
      tutorial,
      updatePos
    );
    const outsideClickListener = event => {
      if(highlighted === undefined || tutorial === undefined) return;
      if (!highlighted.contains(event.target) && !tutorial.contains(event.target)) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    document.addEventListener('click', outsideClickListener, { capture: true });
  })

</script>
<main id="tutorial" bind:this={tutorial}>
  {#if user.tutorialPhase === 1}
    <h1>Tutorial (1/4)</h1>
    <h2>Let's bet on this tutorial question!</h2>
    <h3>Click on the question to continue</h3>
  {:else if user.tutorialPhase === 2}
    <h1>Tutorial (2/4)</h1>
    <h2>Buying shares</h2>
    <pre>You can buy 'Yes' or 'No' shares depending on your prediction on the questions outcome. Buying shares is like betting on the outcome.

The price of a share depends on the likeliness of the event. They change in real time as other traders bet and new information is revealed.

Because the current chance is 80%, a 'Yes' share costs 80 coins, while a 'No' share costs 20 coins.
    </pre>
    <h3>Buy 1 'Yes' share to continue</h3>
  {:else if user.tutorialPhase === 3}
    <h1>Tutorial (2/4)</h1>
    <h2>You now own a 'Yes' Share!</h2>
    <pre>
Because you own a 'Yes' share, you will profit if the question resolves to Yes.

You can sell 'Yes' or 'No' shares at any time, or wait until the question resolves to redeem winning shares for 100 🪙 each.
    </pre>
    <button onclick={()=>{user.tutorialPhase=4;updateTutorialPhase()}}>Continue</button>
  {:else if user.tutorialPhase === 4}
    <h1>Tutorial (3/4)</h1>
    <h2>You can view all your shares here</h2>
    <h3>Click on "My Predictions" in the top bar to continue</h3>
  {:else if user.tutorialPhase === 5}
    <h1>Tutorial (4/4)</h1>
    <h2>Looks like the question has resolved in your favor!</h2>
    <h3>Click on Claim to receive your winnings of 100 🪙</h3>
  {/if}
</main>
<style>
    button{
        cursor: pointer;
        color: white;
        font-size: 18px;
        width: 100%;
        padding: 15px 0px;
        border: none;
        border-radius: 8px;
        background: rgb(20, 82, 240);
    }
    pre{
        max-width: 1000px;
        text-wrap: auto;
    }
    h1{
        font-weight: normal;
        font-size: 15px;
        color: gray;
    }
    h3{
        font-size: 15px;
        font-weight: normal;
        font-style: italic;
    }
    main{
        display: flex;
        flex-direction: column;
        gap: 10px;
        border: 3px solid #e0e0e0;
        position: absolute;

        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 20px;
        box-shadow: 0 30px 60px -15px rgba(0,0,0,0.5), 0 12px 24px -8px rgba(0,0,0,0.25), 0 6px 12px -6px rgba(0,0,0,0.15);
        border-radius: 10px;
        z-index: 10000;
        width: 300px;
    }
</style>