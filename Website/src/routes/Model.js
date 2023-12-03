/* Imported model using TensorflowJS. The imported model can be found in 
   C:\Users\kanel\OneDrive\Desktop\Code\Website\cmnist-website\Website\static\model*/

import * as tf from '@tensorflow/tfjs'

class Model {
	labels = ['零', '一', '二', '三', '四',
                '五', '六', '七', '八', '九',
                '十', '百', '千', '万', '亿'];

    constructor(){
        this.loadModel();
    }

	/**
	 * Loads the model from the specified path and prints its summary.
	 * @returns {Promise<void>} A promise that resolves when the model is loaded.
	 */
    async loadModel() {
		try {
			this.model = await tf.loadLayersModel("model/model.json");
			this.model.summary();
		} catch(e) {
			console.log("Model could not be loaded!");
			console.log(e);
		}
	}

	/**
	 * Calculates and returns the scores for the given input.
	 * @param {any} input - The input data for prediction.
	 * @returns {any} The scores calculated for the input.
	 */
    getScores = (input) => {
		try {
			let scores = this.model.predict(input);
			scores = scores.softmax();
			return scores;
		} catch(e) {
			console.log('Issues with getting scores!');
			console.log(e);
		}
	}

	/**
	 * Calculates the prediction based on the given scores.
	 * @param {Tensor} scores - The scores obtained from the model.
	 * @returns {Array} - An array containing the predicted label and the prediction value.
	 */
	getPrediction = (scores) => {
		let scoreArr = scores.arraySync()['0'];
		let indexOfMaxValue = scoreArr.reduce((bestIdx, currElem, currIdx, scoreArr) => currElem > scoreArr[bestIdx] ? currIdx : bestIdx, 0);
		let predictionValue = scoreArr[indexOfMaxValue] * 100;
		return [this.labels[indexOfMaxValue], predictionValue.toFixed(1)];
	}
}

export const model = new Model();