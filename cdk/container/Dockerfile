# Use the official TensorFlow Docker image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the application code
COPY index-flask.py /app/
COPY local_custom_model.keras /app/

# Install additional Python packages
RUN pip install flask numpy flask-cors
RUN pip install tensorflow
RUN apt-get -y update; apt-get -y install curl

# Run the Flask application
CMD ["python", "index-flask.py"]
