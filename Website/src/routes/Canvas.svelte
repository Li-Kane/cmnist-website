<!-- Canvas module which a,llows users to draw on and clear drawings as well-->

<script>
	import { onMount } from 'svelte'
	
	export let width = 256
	export let height = 256
	export let color = '#333'
	export let background = '#000'

	/**
	 * Initializes the canvas context and sets the line width.
	 * Also calls the handleSize function to handle canvas size.
	 */
	onMount(() => {
		context = canvas.getContext('2d')
		context.lineWidth = 5
		
		handleSize()
	})

	let canvas
	let context
	let isDrawing
	let start
	let t, l

	/**
	 * Clears the canvas by clearing the entire context.
	 */
	export const clearCanvas = () => {
		context.clearRect(0, 0, width, height)
	}
	
	$: if(context) {
			context.strokeStyle = color
	}
	
	//Clear canvas is color is background, otherwise start drawing
	const handleStart = (({ offsetX: x, offsetY: y }) => { 
		isDrawing = true
		start = { x, y }
	})
	
	const handleEnd = () => { isDrawing = false }
	/**
	 * Handles the move event when the user is drawing on the canvas.
	 * 
	 * @param {MouseEvent} event - The mouse event object.
	 */
	const handleMove = (({ offsetX: x1, offsetY: y1 }) => {
		if(!isDrawing) return
		
		const { x, y } = start
		context.beginPath()
		context.moveTo(x, y)
		context.lineTo(x1, y1)
		context.closePath()
		context.stroke()
		
		start = { x: x1, y: y1 }
	})
	
	//Gets the size of the rect
	const handleSize = () => {
		const { top, left } = canvas.getBoundingClientRect()
		t = top
		l = left
	}
</script>

<svelte:window on:resize={handleSize} />

<canvas
	{width}
	{height}
	style:background
	bind:this={canvas} 
	on:mousedown={handleStart}	
	on:touchstart={e => {
		const { clientX, clientY } = e.touches[0]
		handleStart({
			offsetX: clientX - l,
			offsetY: clientY - t
		})
	}}	
	on:mouseup={handleEnd}				
	on:touchend={handleEnd}				
	on:mouseleave={handleEnd}
	on:mousemove={handleMove}
	on:touchmove={e => {
		const { clientX, clientY } = e.touches[0]
		handleMove({
			offsetX: clientX - l,
			offsetY: clientY - t
		})
	}}
	id='drawing'
	/>