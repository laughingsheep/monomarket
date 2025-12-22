<script>
  import Chart from 'chart.js/auto';
  import {onMount} from "svelte";
  import 'chartjs-adapter-date-fns';
  let { priceHistory, yesPrice} = $props();
  let displayPrice = $state(yesPrice);
  let chartElement = null;
  const dataPoints = priceHistory.map(({ t, p }) => ({
    x: new Date(t * 1000),
    y: Number(p) * 100,
  }));
  function change(value){
    displayPrice = Math.round(value);
    return value;
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
        parsing: true,
        onHover: (event, activeElements, chart) => {
          const el = activeElements?.[0];
          if (!el) return;
          const { datasetIndex, index } = el;
          const ds = chart.data.datasets[datasetIndex];
          const x = chart.data.labels[index];
          const y = ds.data[index];

          // your logic on hover:
          // e.g., update UI, show custom tooltip, highlight
          // console.log({ datasetIndex, index, x, y });
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              // Format tooltip label

              label: (ctx) => `Price: ${Math.round(change(ctx.parsed.y))}`
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
              stepSize: 10,        // or any integer step you want
              precision: 0,        // force integer formatting (no decimals)
              callback: (value) => Math.round(value) // optional: ensure integers
            }
          }
        }
      }
    });
  })
</script>
<h2 style="--color: {colorForValue(displayPrice)}">{displayPrice}% chance</h2>
<canvas width="900" height="300" bind:this={chartElement} onmouseout={displayPrice=yesPrice}>

</canvas>
<style>
    h2{
        margin: 20px 0;
        font-size: 30px;
        color: var(--color);
    }
</style>