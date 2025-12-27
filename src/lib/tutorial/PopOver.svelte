<script>
  let { tutorial = $bindable() } = $props();
</script>
<main id="tutorial" bind:this={tutorial}>
    <h1>Tutorial (1/4)</h1>
    <h2>Let's bet on this tutorial question!</h2>
    <h3>Click on the question to continue</h3>
  </main>
<style>
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