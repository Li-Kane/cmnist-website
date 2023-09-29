import * as tf from '@tensorflow/tfjs'

class Model {
    constructor(){
        this.loadModel();
    }

    async loadModel() {
		try {
			this.model = await tf.loadLayersModel("model_unreg/model.json");
			this.model.summary();
		} catch(e) {
			console.log("Model could not be loaded!");
		}
	}

    modelPredict = (input) => {
		let scores = this.model.predict(input);
		this.scores = scores.softmax();
        //this.scores.print();
		return this.scores;
	}
}

export const model = new Model();