const tf = require('@tensorflow/tfjs-node'); // TensorFlow.js
const express = require('express'); // Express.js for the API

// Initialize Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON

let model;

// Load the TensorFlow model
(async () => {
    try {
        model = await tf.loadLayersModel('localstorage://local_custom_model.keras'); // Model converted to TensorFlow.js format
        console.log("Model loaded successfully");
    } catch (error) {
        console.error("Error loading model:", error);
    }
})();

// Define an endpoint for predictions
app.post('/predict', async (req, res) => {
    try {
        const data = req.body;

        // Check if features are present
        if (!data.features) {
            return res.status(400).json({ error: "Features are missing in the request" });
        }

        // Make predictions
        const inputTensor = tf.tensor([data.features]); // Convert input data to Tensor
        const predictions = model.predict(inputTensor);
        const predictedValues = await predictions.array(); // Convert tensor to array

        const predictedBMI = predictedValues[0][0];
        const predictedBloodPressure = predictedValues[0][1];

        // Return predictions as JSON
        res.json({
            BMI: predictedBMI,
            BloodPressure: predictedBloodPressure
        });
    } catch (error) {
        console.error("Error during prediction:", error);
        res.status(400).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Lambda handler for AWS Lambda
exports.lambdaHandler = async (event, context) => {
    console.log("Hello AWS!");
    console.log("event =", JSON.stringify(event));

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Lambda function executed successfully" }),
    };
};
