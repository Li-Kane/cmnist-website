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
		'rgba(238, 73, 73, 0.2)',
		'rgba(238, 108, 73, 0.2)',
		'rgba(238, 158, 73, 0.2)',
		'rgba(249, 238, 72, 0.2)',
		'rgba(220, 249, 72, 0.2)',
		'rgba(122, 238, 56, 0.2)',
		'rgba(56, 238, 67, 0.2)',
        'rgba(88, 242, 184, 0.2)',
		'rgba(51, 253, 241 , 0.2)',
		'rgba(51, 158, 253, 0.2)',
		'rgba(24, 16, 178, 0.2)',
		'rgba(102, 16, 178, 0.2)',
		'rgba(161, 16, 178, 0.2)',
		'rgba(255, 56, 228, 0.2)',
        'rgba(247, 205, 227, 0.2)',
		'rgba(147, 146, 146, 0.2)'
		],
		borderColor: [
		'rgba(238, 73, 73)',
		'rgba(238, 108, 73)',
		'rgba(238, 158, 73)',
		'rgba(249, 238, 72)',
		'rgba(220, 249, 72)',
		'rgba(122, 238, 56)',
		'rgba(56, 238, 67)',
        'rgba(88, 242, 184)',
		'rgba(51, 253, 241)',
		'rgba(51, 158, 253)',
		'rgba(24, 16, 178)',
		'rgba(102, 16, 178)',
		'rgba(161, 16, 178)',
		'rgba(255, 56, 228)',
        'rgba(247, 205, 227)',
		'rgba(147, 146, 146)'
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
	})
</script>

<canvas bind:this={portfolio} />