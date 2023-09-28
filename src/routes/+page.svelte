<script>
	import Canvas from './Canvas.svelte'
	import Palette from './Palette.svelte'
	import * as tf from '@tensorflow/tfjs'

	let model;

	async function loadModel() {
		try {
			model = await tf.loadLayersModel("model_unreg/model.json");
		} catch(e) {
			console.log("Model could not be loaded!");
		}
	}

	const getImageData = () => {
		const originalCanvas = document.getElementById("drawing");
		//const context = originalCanvas.getContext('2d');
		// Create a new canvas element with a 64x64 size
		const resizedCanvas = document.createElement('canvas');
    	resizedCanvas.width = 64;
    	resizedCanvas.height = 64;
		const resizedContext = resizedCanvas.getContext('2d');
    	resizedContext.drawImage(originalCanvas, 0, 0, 64, 64);
		const imageData = resizedContext.getImageData(0, 0, 64, 64);
		console.log(imageData.data);
		//visualize resized if you want
		//context.putImageData(imageData, 0, 0);
		loadModel();
		
		model.summary();
	}
	
	let canvasChild;
	const colors = [
		'#fff'
	]
	const background = '#000';

	let color = colors[0];
	const paletteColor = color;
</script>

<main>
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
					}}"/>
	<button on:click={getImageData}>
		Make a Prediction!
	</button>
	<p>Vectors and icons by <a href="https://www.svgrepo.com" target="_blank">SVG Repo</a></p>
</main>

<style>	
	:global(body) {
		margin: 0;
		padding: 0;
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #e5e5e5;
	}
	
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
		max-width: 300px;
		display: flex;
		flex-direction: column;
		gap: 0.5rem 0;
	}
	
	main :global(canvas) {
		align-self: center;
	}
	
</style>