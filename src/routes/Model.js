class Model {
    constructor() {
        this.model = this.loadModel()
    }

    loadModel() {
		console.time("Load model")
		return tf.loadLayersModel("model/model.json").then(model => {
			this._model = model;
			console.timeEnd("Load model")
		})
	}
}