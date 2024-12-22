import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin


# Initialize Flask app
app = Flask(__name__)
cors = CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'

# Load the TensorFlow model
model = tf.keras.models.load_model('local_custom_model.keras')
print("Model loaded successfully")

@app.route('/', methods=['GET'])
def index():
    return "Works",200
# Define an endpoint for predictions
@app.route('/predict', methods=['POST'])
def predict():
    # Parse input JSON
    data = request.get_json()
    try:
        # Extract input data
        # return jsonify({"error": str(data)}), 200
        # input_features = np.array(data['features']).reshape(1, -1)
        
        # Make predictions
        # return data["features"], 400
        predictions = model.predict(np.array([data['features']]))
        
        predicted_bmi = float(predictions[0, 0]) 
        predicted_DiabetesPedigreeFunction = float(predictions[0, 1])

        # Return predictions as JSON
        return jsonify({
            "BMI": predicted_bmi,
            "DiabetesPedigreeFunction": predicted_DiabetesPedigreeFunction
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Run the application
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
