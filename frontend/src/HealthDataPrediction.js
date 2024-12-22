import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';

function HealthDataPrediction() {
    const [features, setFeatures] = useState({
        Glucose: '',
        BloodPressure: '',
        SkinThickness: '',
        Insulin: '',
        Age: ''
    });
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFeatures({
            ...features,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Prepare the features as an array of numbers
            const featuresArray = [
                parseInt(features.Glucose),
                parseInt(features.BloodPressure),
                parseInt(features.SkinThickness),
                parseInt(features.Insulin),
                parseInt(features.Age)
            ];

            // Send the POST request to the backend
            const response = await axios.post(
                'http://CdkSta-amazo-J8hvOojeWQAr-1948932929.us-east-1.elb.amazonaws.com/predict', 
                {
                    features: featuresArray
                }
            );
            
            // Handle the response (you can process this according to your backend logic)
            setPrediction(response.data); // Assuming the response contains the prediction
            setError('');
        } catch (err) {
            setError('Error: ' + err.message); // Handle any errors
            setPrediction(null);
        }
    };

    return (
        <Container style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                Health Data Prediction
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Glucose"
                    type="number"
                    name="Glucose"
                    value={features.Glucose}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Blood Pressure"
                    type="number"
                    name="BloodPressure"
                    value={features.BloodPressure}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Skin Thickness"
                    type="number"
                    name="SkinThickness"
                    value={features.SkinThickness}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Insulin"
                    type="number"
                    name="Insulin"
                    value={features.Insulin}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Age"
                    type="number"
                    name="Age"
                    value={features.Age}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Submit
                </Button>
            </form>

            {prediction && (
                <div style={{ marginTop: '2rem' }}>
                    <Typography variant="h6">Prediction Result:</Typography>
                    <Typography variant="body1">BMI: {prediction.BMI}</Typography>
                    <Typography variant="body1">Diabetes Pedigree Function: {prediction.DiabetesPedigreeFunction}</Typography>
                </div>
            )}
            {error && (
                <Typography variant="h6" color="error" style={{ marginTop: '2rem' }}>
                    {error}
                </Typography>
            )}
        </Container>
    );
}

export default HealthDataPrediction;