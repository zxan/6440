import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Grid, MenuItem } from '@mui/material'; // Make sure MenuItem is imported

function PatientDataForm() {
    const [formData, setFormData] = useState({
        userId: 'user789', // Default userId, change this as needed
        timestamp: '',
        bloodPressure: '',
        bmi: '',
        diabetesRisk: 'Low',
    });

    const riskOptions = ['Low', 'Moderate', 'High'];

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Log the payload
        console.log("Data being sent to the API:", formData);
    
        try {
            const response = await fetch('https://xq6okx5rca.execute-api.us-east-1.amazonaws.com/prod/healthdata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
    
            const data = await response.json();
            console.log('Response from API:', data);
    
            // Reset form data and show success message
            setFormData({
                timestamp: '',
                bloodPressure: '',
                bmi: '',
                diabetesRisk: 'Low',
            });
            alert('Data submitted successfully!');
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit data.');
        }
    };
    
    return (
        <Container maxWidth="sm">
            <Paper style={{ padding: 20, marginTop: 20 }}>
                <Typography variant="h4" gutterBottom>
                    Patient Data Input
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                        <TextField
                            label="Timestamp"
                            name="timestamp"
                            type="datetime-local"
                            value={formData.timestamp}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{
                                shrink: true, // To make the label appear correctly when input is filled
                            }}
                        />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Blood Pressure (e.g., 120/80)"
                                name="bloodPressure"
                                type="text"
                                value={formData.bloodPressure}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="BMI (e.g., 22.5)"
                                name="bmi"
                                type="number" // Allow numeric input
                                value={formData.bmi}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                select
                                label="Diabetes Risk"
                                name="diabetesRisk"
                                value={formData.diabetesRisk}
                                onChange={handleChange}
                                fullWidth
                            >
                                {riskOptions.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" type="submit" fullWidth>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}

export default PatientDataForm;
