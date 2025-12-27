<script>
  let hide = $state(false);
  import {user, updateTutorialPhase} from "$lib/index.svelte.js";
</script>
<main class={hide ? 'hidden' : ''}>
  <section>
    <img src="/monomarketmockup.png" alt="Monomarket Banner" />
    <h1>Can you predict the future?</h1>
    <p>
      Monomarket is a just-for-fun prediction platform where you bet on future events like:

      • Will Zoomania 2 be the highest-grossing movie?
      • Will ChatGPT be the most downloaded app this year?
      • Will the USA experience a recession next year?

      Predict correctly and earn coins!
    </p>
    <button onclick={()=>{hide=true;user.tutorialPhase=1;updateTutorialPhase()}}>Bet on a question</button>
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
      z-index: 1000;
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
