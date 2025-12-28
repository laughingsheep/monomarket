<script>
  import Chart from 'chart.js/auto';
  import {onMount} from "svelte";
  import 'chartjs-adapter-date-fns';
  import {calculateSharePrice} from "$lib/index.svelte.js";
  let { priceHistory, yesPrice} = $props();
  let displayPrice = $state(yesPrice);
  let chartElement = null;
  const dataPoints = priceHistory.map(({ t, p }) => ({
    x: new Date(t * 1000),
    y: Number(p) * 100,
  }));
  function change(value){
    displayPrice = calculateSharePrice(value / 100);
    return displayPrice;
  }
  function colorForValue(v){
    v=Math.max(0,Math.min(100,+v));
    const h=x=>{x=x.replace("#","");if(x.length===3)x=x.split("").map(c=>c+c).join("");return [parseInt(x.slice(0,2),16),parseInt(x.slice(2,4),16),parseInt(x.slice(4,6),16)]};
    const p=v<=50?0:50,q=v<=50?50:100;
    const [ar,ag,ab]=v<=50?h("#D90D0D"):h("#C7C757");
    const [br,bg,bb]=v<=50?h("#C7C757"):h("#0DFF00");
    const t=(v-p)/(q-p);
    const r=Math.round(ar+(br-ar)*t),g=Math.round(ag+(bg-ag)*t),b=Math.round(ab+(bb-ab)*t);
    const s=n=>n.toString(16).padStart(2,"0");
    return "#"+s(r)+s(g)+s(b);
  }
  onMount(()=>{
    const chart = new Chart(chartElement.getContext('2d'), {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Price',
            data: dataPoints,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.15)',
            tension: 0.25,            // slight smoothing
            pointRadius: 0,           // hide points for cleaner look
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: false,
        parsing: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              // Format tooltip label

              label: (ctx) => `Price: ${change(ctx.parsed.y)}`
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            ticks: {
              // Example: use locale date format
              source: 'auto'
            },
            grid: { display: false }
          },
          y: {
            title: { display: false, text: 'Price' },
            grid: { color: 'rgba(0,0,0,0.08)' },
            min: 0,
            max: 100,
            ticks: {
              stepSize: 10,
              precision: 0,
              callback: (value) => Math.round(value)
            }
          }
        }
      }
    });
  })
</script>
<div id="questionholder">
  <h2 style="--color: {colorForValue(displayPrice)}">{displayPrice}% chance</h2>
</div>

<canvas width="1000" height="300" bind:this={chartElement} onmouseout={()=>{displayPrice=yesPrice}}>

</canvas>
<style>
    #questionholder {
        width: max-content;
        border-radius: 5px;

        background: white;
        position: relative;
        z-index: 2;
    }
    canvas{
        width: 100%;
        max-width: 900px;
        height: 300px;
    }
    h2{
        margin: 20px 0;
        font-size: 30px;
        color: var(--color);
    }

    @media (max-width: 600px) {
        canvas {
            height: 200px;
        }
        h2 {
            font-size: 24px;
        }
    }
</style>