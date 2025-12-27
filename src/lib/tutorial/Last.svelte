<script>
  import {onMount} from "svelte";
  let hide = $state(false);
  import {user, updateTutorialPhase} from "$lib/index.svelte.js";
  onMount(()=>{
   if(user.tutorialPhase === 6){
     user.tutorialPhase = 7;
     updateTutorialPhase();
     user.balance = 1000;
     localStorage.setItem("balance", user.balance);
   }
    confetti();
  })
</script>
<main class={hide ? 'hidden' : ''}>
  <section>
    <img src="/monomarketmockup.png" alt="Monomarket Banner" />
    <h1>Tutorial completed!</h1>
    <p>
      You now know everything to start using Monomarket.
      To get you started, we have set your balance to 1000 🪙
      Good luck and have fun predicting!
    </p>
    <button onclick={()=>{user.tutorialPhase=8;updateTutorialPhase();location.href="/"}}>Explore questions</button>
  </section>
</main>
<style>
    .hidden{
        display: none;
    }
    img{
        width:100%;
        border-radius: 10px;
    }
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
    p {
        color: rgb(119, 128, 141);
        white-space: pre-line;
    }
    section{
        display: flex;
        flex-direction: column;
        background: white;
        gap: 20px;
        width: 450px;
        padding: 20px;
        box-shadow: 0 0 0 9999px rgba(0,0,0,0.65);;
        border-radius: 12px;

    }
    main{
        top: 0px;
        z-index: 10;
        position: fixed;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        /*box shadow that covers whole page*/
        box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 100vw, rgba(0, 0, 0, 0.1) 0px 0px 0px 100vw, rgba(0, 0, 0, 0.1) 0px 0px 0px 100vw, rgba(0, 0, 0, 0.1) 0px 0px 0px 100vw, oklab(0 0 0 / 0.04) 0px 8px 16px 0px;
    }
</style>
