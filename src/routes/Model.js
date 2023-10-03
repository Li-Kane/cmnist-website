import * as tf from '@tensorflow/tfjs'

class Model {
	labels = ['N/A', '零', '一', '二', '三', '四',
                    '五', '六', '七', '八', '九',
                    '十', '百', '千', '万', '亿'];

    constructor(){
        this.loadModel();
    }

    async loadModel() {
		try {
			this.model = await tf.loadLayersModel("model/model.json");
			this.model.summary();
		} catch(e) {
			console.log("Model could not be loaded!");
			console.log(e);
		}
	}

    getScores = (input) => {
		let scores = this.model.predict(input);
		scores = scores.softmax();
		return scores;
	}

	getPrediction = (scores) => {
		let scoreArr = scores.arraySync()['0'];
		let indexOfMaxValue = scoreArr.reduce((bestIdx, currElem, currIdx, scoreArr) => currElem > scoreArr[bestIdx] ? currIdx : bestIdx, 0);
		let predictionValue = scoreArr[indexOfMaxValue] * 100;
		return [this.labels[indexOfMaxValue], predictionValue.toFixed(1)];
	}
}

export const model = new Model();