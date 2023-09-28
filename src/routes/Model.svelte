<script>
    const tf = require('@tensorflow/tfjs-node');
    const handler = tfn.io.fileSystem("model.json");

    async function loadModel() {
        const model = await tf.loadLayersModel(handler);
        return model;
    }
</script>