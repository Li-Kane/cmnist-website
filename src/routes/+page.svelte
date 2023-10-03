<script>
	import Canvas from './Canvas.svelte'
	import Palette from './Palette.svelte'
	import Chart from './Chart.svelte'
	import {model} from './Model'
	import * as tf from '@tensorflow/tfjs'
	import Marquee from 'svelte-fast-marquee';


	const numCharacters = 15;
	let preloadImageUrls = [...Array(numCharacters).keys()].map((key) => `/characters/${key}.png`);
	let labels = ['líng', 'yī', 'èr', 'sān', 'sì', 'wǔ', 'liù', 'qī', 'bā', 'jiǔ', 'shí', 'bǎi', 'qiān', 'wàn', 'yì']

	let canvasChild;
	const colors = [
		'#fff'
	]
	const background = '#000';
	let color = colors[0];
	const paletteColor = color;

	let displayChart = false;
	let scores = [];

	const getImageData = () => {
		const originalCanvas = document.getElementById("drawing");
		// Create a new canvas element with a 64x64 size
		const resizedCanvas = document.createElement('canvas');
    	resizedCanvas.width = 64;
    	resizedCanvas.height = 64;
		const resizedContext = resizedCanvas.getContext('2d');
    	resizedContext.drawImage(originalCanvas, 0, 0, 64, 64);
		const imageData = resizedContext.getImageData(0, 0, 64, 64);
		//visualize resized if you want
		/*
		const context = originalCanvas.getContext('2d');
		context.strokeRect(0, 0, 64, 64);
		context.putImageData(imageData, 1, 1);
		*/
		//reshape data into (1, 64, 64, 3) tensor
		let reshapedData = reshapeData(imageData);
		try{
			scores = model.getScores(reshapedData);
			displayChart = true;
		} catch(e) {
			console.log("Issues in the prediction!");
			console.log(e);
		}
	}

	const reshapeData = (data) => {
		const divide = tf.scalar(255.0);
		let reshaped = tf.tensor(data.data, [1, 64, 64, 4]);
		reshaped = tf.slice4d(reshaped, [0, 0, 0, 0], [1, 64, 64, 3]);
		reshaped = reshaped.div(divide);
		return reshaped;
	}
</script>

<main>
	<h1 id='header' class="text-5xl font-extrabold dark:text-white">CMNIST Predictor</h1>
	<Marquee class='image-slider' pauseOnHover={true} speed={50} 
	play={true} gradient={true} --gradientColor='#e5e5e5'>
		{#each preloadImageUrls as path, index}
			<div class='character'>
				<img src='{path}' alt='{index}.png' />
				<div class='label'>
					<h1>{labels[index]}</h1>
				</div>
			</div>
		{/each}
	</Marquee>
	<div class='drawing'>
		<Canvas bind:this={canvasChild}
					{color} 
					{background}/>
		<Palette 
						{paletteColor}
						{colors}
						on:color="{({ detail }) => {
								color = detail.color
							}}"
						on:clearCanvas="{() => {
								canvasChild.clearCanvas();
								displayChart = false;
						}}"/>
	</div>
	<button id='prediction-btn' class="text-white font-bold py-2 px-4 rounded" on:click={getImageData}>
		Make a Prediction!
	  </button>
	{#if displayChart}
		<div class='prediction'>
			<h2>Prediction: {model.getPrediction(scores)[0]} ({model.getPrediction(scores)[1]}%)</h2>
		</div>
		<Chart {scores}/>
	{/if}
	<button id='about-btn' class="text-white font-bold py-2 px-4 rounded">
		<img class="fill-current w-4 h-4 mr-2" src='/icons/down-arrow.svg' alt='downarrow'>
		<span>About</span>
	</button>

	<p>Vectors and icons by <a href="https://www.svgrepo.com" target="_blank">SVG Repo</a></p>
</main>

<style lang='scss'>	
	:global(body) {
		margin: 0;
		padding: 0;
		min-height: 100vh;
		display: flex;
		justify-content: center;
		background: #e5e5e5;
	}
	
	/* Hides excess palette stuff*/
	:global(.visually-hidden:not(:focus):not(:active)) {
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		height: 1px;
		width: 1px;
		overflow: hidden;
		position: absolute;
		white-space: nowrap;
	}

	main {
		max-width: 500px;
		display: flex;
		flex-direction: column;
		gap: 0.5rem 0;
		align-items: center;
	}
	
	main :global(canvas) {
		align-self: center;
	}

	#header {
		padding: 10vh 0px 5vh;
		color: #800020;
		align-self: center;
	}

	.drawing {
		width: 256px;
		display: flex;
		flex-direction: column;
		align-self: center;
	}

	.character{
		width: 70px;
		border: 3px solid #000000;

		img {
			height: 60px;
			width: 100%;
			border-bottom: 3px solid #000000;
		}

		.label {
			width: 100%;
			text-align: center;
			background-color: white;
		}
	}

	.prediction {
		text-align: center;
		font-size: large;
	}

	#prediction-btn {
		background-color: #800020;
	}

	#prediction-btn:hover, #about-btn:hover {
		background-color: #d50a3d;
	}

	#about-btn {
		background-color: #800020;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 100px;
	}
</style>