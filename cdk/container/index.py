import numpy as np
import tensorflow as tf
from flask import jsonify

# Initialize Flask app
# app = Flask(__name__)

# Load the TensorFlow model
model = tf.keras.models.load_model('local_custom_model.keras')
# print("Model loaded successfully")

# # Define an endpoint for predictions
# @app.route('/predict', methods=['POST'])
def predict():
    # Parse input JSON
    data = []
    try:
        # Extract input data
        # return jsonify({"error": str(data)}), 200
        # input_features = np.array(data['features']).reshape(1, -1)
        
        # Make predictions
        # return data["features"], 400
        predictions = model.predict(np.array([data['features']]))
        
        predicted_bmi = float(predictions[0, 0]) 
        predicted_bloodpressure = float(predictions[0, 1])

        # Return predictions as JSON
        return jsonify({
            "BMI": predicted_bmi,
            "BloodPressure": predicted_bloodpressure
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# # Run the application
# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=8080)


def lambda_handler(event, context):
    print("Hello AWS!")
    print("event = {}".format(event))
    return {
        'statusCode': 200,
    }