<script>
    import * as tf from '@tensorflow/tfjs'
    import Chart from 'chart.js/auto';
    import {onMount} from 'svelte'
    
    export let scores;

    let portfolio;
	const labels = ['零', '一', '二', '三', '四',
                    '五', '六', '七', '八', '九',
                    '十', '百', '千', '万', '亿'];
	const data = {
	labels: labels,
	datasets: [{
		label: 'Your predictions!',
		data: scores.arraySync()['0'],
		backgroundColor: [
		'rgba(255, 99, 132, 0.2)',
		'rgba(255, 159, 64, 0.2)',
		'rgba(255, 205, 86, 0.2)',
		'rgba(75, 192, 192, 0.2)',
		'rgba(54, 162, 235, 0.2)',
		'rgba(153, 102, 255, 0.2)',
		'rgba(201, 203, 207, 0.2)',
        'rgba(255, 99, 132, 0.2)',
		'rgba(255, 159, 64, 0.2)',
		'rgba(255, 205, 86, 0.2)',
		'rgba(75, 192, 192, 0.2)',
		'rgba(54, 162, 235, 0.2)',
		'rgba(153, 102, 255, 0.2)',
		'rgba(201, 203, 207, 0.2)',
        'rgba(201, 203, 207, 0.2)'
		],
		borderColor: [
		'rgb(255, 99, 132)',
		'rgb(255, 159, 64)',
		'rgb(255, 205, 86)',
		'rgb(75, 192, 192)',
		'rgb(54, 162, 235)',
		'rgb(153, 102, 255)',
		'rgb(201, 203, 207)',
        'rgb(255, 99, 132)',
		'rgb(255, 159, 64)',
		'rgb(255, 205, 86)',
		'rgb(75, 192, 192)',
		'rgb(54, 162, 235)',
		'rgb(153, 102, 255)',
		'rgb(201, 203, 207)',
        'rgb(201, 203, 207)'
		],
		borderWidth: 1
	}]
	};
	const config = {
		type: 'bar',
		data: data,
		options: {
			scales: {
				y: {
					beginAtZero: true,
					max: 1,
					min: 0
				},
                x: {
                    ticks: {
                        autoSkip: false
                    }
                }
			},
		},
	};

    onMount(() => {
		const ctx = portfolio.getContext('2d');
        // Initialize chart using default config set
        var myChart = new Chart(ctx, config);
        let prediction = tf.argMax(scores);
        console.log(prediction);
	})
</script>

<canvas bind:this={portfolio} width={500} height={400} />