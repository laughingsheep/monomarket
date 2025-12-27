<script>
  import { user, formatCoins, saveStocks} from "$lib/index.svelte.js";
  import {onMount} from "svelte";
  import {Toaster} from "svelte-french-toast";
  import PopOver from "$lib/tutorial/PopOver.svelte";
  let searchTerm = $state("");
  let loc = $state();
  let inputField = $state();
  onMount(()=>{
    if(localStorage.getItem("stocks") == null){
      user.stocks = [];
      saveStocks();
    }
    if(localStorage.getItem("tutorialPhase") == null){
      localStorage.setItem("tutorialPhase", 0);
    }
    user.tutorialPhase = parseInt(localStorage.getItem("tutorialPhase"));
    user.stocks = JSON.parse(localStorage.getItem("stocks"));
    if(localStorage.getItem("balance") == null){
      user.balance = 80;
      localStorage.setItem("balance", user.balance);
    }
    user.balance = parseInt(localStorage.getItem("balance"));
    loc = location.pathname;
    if(location.pathname.split("/")[1] === "search"){
      searchTerm = decodeURI(location.pathname.split("/").at(-1));
      inputField.focus()
    }
  });
  function search(e){
    if (e.key === 'Enter') {
      e.preventDefault();
      window.location.href = "/search/" + searchTerm;
    }
  }
  let main = $state();
</script>
<Toaster />
{#if [4].includes(user.tutorialPhase)}
  <PopOver highlighted={main} />
{/if}
<nav>
  <main>
    <div id="links">
      <img id="logo" src="/logo.png" alt="Monomarket" onclick={location.href="/"}/>
      <a href="/" class={loc === "/" ? "active" : ""}>Explore</a>
      <a bind:this={main} href="/predictions" class={loc === "/predictions" ? "active" : ""}>My Predictions</a>
      <div id="inputContainer">
        <div id="iconContainer">
          <svg height="18" width="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" class=""><title>magnifier</title><g fill="currentColor"><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" x1="15.25" x2="11.285" y1="15.25" y2="11.285"></line><circle cx="7.75" cy="7.75" fill="none" r="5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle></g></svg>
        </div>
        <input bind:this={inputField} type="text" id="search" placeholder="Search markets..." onkeydown={search} bind:value={searchTerm}/>
      </div>
    </div>
    <div>
      <b>{formatCoins(user.balance)}</b>
    </div>

  </main>
</nav>

<style>
    svg{
        display: block;
        color: #77808d;
    }
    #iconContainer{
        position: absolute;
        top: 30%;
        left: 1rem;
    }
    #inputContainer{
        position: relative;
    }
    input{
        -webkit-tap-highlight-color: initial !important;
        background-color: #F4F5F6 !important;
        border: 1px solid transparent !important;
        border-radius: calc(.6rem - 2px) !important;
        box-sizing: border-box !important;
        color: #18181B !important;
        display: flex !important;
        font-size: 1rem !important;
        height: calc(.25rem*12) !important;
        line-height: calc(1.5/1) !important;
        padding-block-end: 4px !important;
        padding-block-start: 4px !important;
        padding-inline-end: 12px !important;
        padding-inline-start: 44px !important;
        padding: 0 0 0 calc(.25rem*11) !important;
        tab-size: 4 !important;
        width: 400px;
        -webkit-tap-highlight-color: transparent !important;
    }
    .active{
        color: #2e5cff;
        font-weight: bold;
    }
    #links{
        display: flex;
        align-items: center;
        gap: 20px;
    }
    a{
        text-decoration: none;
        color: black;
        font-weight: 500;
        font-size: 16px;
    }
  img{
      height: 60px;
      cursor: pointer;
  }
  b{
      font-size: 20px;
  }
  nav{
      padding-left: 20px;
      padding-right: 20px;
      margin-bottom: 20px;
      padding-top: 16px;
      padding-bottom: 16px;
      border-bottom: 1px #e7e8ea solid;
      display: flex;
      justify-content: center;
  }
  main{
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 1360px;
  }
</style>