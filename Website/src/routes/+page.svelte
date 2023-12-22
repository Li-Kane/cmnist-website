<!-- +page.svelte is the main page which the user sees -->
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

	/**
	 * Function to get the image data from the canvas element and feed it into the model.
	 * @returns {void}
	 */
	const getImageData = () => {
		const originalCanvas = document.getElementById("drawing");
		// Create a new canvas element with a 64x64 size to feed into the model
		const resizedCanvas = document.createElement('canvas');
		resizedCanvas.width = 64;
		resizedCanvas.height = 64;
		const resizedContext = resizedCanvas.getContext('2d');
		resizedContext.drawImage(originalCanvas, 0, 0, 64, 64);
		const imageData = resizedContext.getImageData(0, 0, 64, 64);
		// Uncomment this to see the resized image sent to the model
		
		const context = originalCanvas.getContext('2d');
		context.strokeRect(0, 0, 64, 64);
		context.putImageData(imageData, 1, 1);
		
		// Reshape data into (1, 64, 64, 3) tensor
		let reshapedData = reshapeData(imageData);
		scores = model.getScores(reshapedData);
		if (scores) {
			displayChart = true;
		}
	}

	const reshapeData = (data) => {
		//reshape to (1, 64, 64, 3)
		let reshaped = tf.tensor(data.data, [1, 64, 64, 4]);
		reshaped = tf.slice4d(reshaped, [0, 0, 0, 0], [1, 64, 64, 3]);
		//rescale to 0-1
		const divide = tf.scalar(255.0);
		reshaped = reshaped.div(divide);
		return reshaped;
	}
</script>

<main>
	<div class='canvas-header'>
		<div id='header'>
			<h1 class="text-5xl font-extrabold dark:text-white">CMNIST Predictor</h1>
			<p>Draw a character and a convolutional neural network will make a prediction!
				It will attempt to classify according to the classes in the slider below.
				If you're curious to learn more, check out this github link 
				<a href="https://github.com/Li-Kane/cmnist-website" target="_blank">here</a>!
			</p>
		</div>
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
	</div>
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
	<div id='chart-container'> 
		{#if displayChart}
			<div class='prediction'>
				<h2>Prediction: {model.getPrediction(scores)[0]} ({model.getPrediction(scores)[1]}%)</h2>
			</div>
			<Chart {scores}/>
		{/if}
	</div>
	<p id='credit'>Vectors and icons by <a href="https://www.svgrepo.com" target="_blank">SVG Repo</a></p>
</main>

<style>	
	:global(body) {
		margin: 0;
		padding: 0;
		min-height: 100%;
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

	a {
    	color: blue; /* Or any color you prefer */
    	text-decoration: underline; /* This adds the underline back */
	}

	.canvas-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem 0;
		min-width: 256px;
		max-width: 40%;
		margin-top: 50px;
	}

	#chart-container {
		position: relative;
		width: 80vw;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	main {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		gap: 0.5rem 0;
		align-items: center;
	}
	
	main :global(canvas) {
		align-self: center;
	}

	#header {
		align-self: center;
		text-align: center;
	}

	#header h1 {
		padding-bottom: 1vh;
		color: #800020;
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
	}

	#credit {
		position: fixed;
		top: 2%;
		right: 2%;
	}

	.character img {
		height: 60px;
		width: 100%;
		border-bottom: 3px solid #000000;
	}

	.character .label {
		width: 100%;
		text-align: center;
		background-color: white;
	}

	.prediction {
		text-align: center;
		font-size: large;
	}

	#prediction-btn {
		background-color: #800020;
	}

	#prediction-btn:hover {
		background-color: #d50a3d;
	}
</style>