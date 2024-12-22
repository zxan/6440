import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, CircularProgress } from '@mui/material';
import BasicTable from './component/BasicTable'; // Import BasicTable component

function Home() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const apiUrl = "https://xq6okx5rca.execute-api.us-east-1.amazonaws.com/prod/healthdata";

    // Fetch the patient data
    useEffect(() => {
        document.title = 'Health Monitoring Dashboard';

        const fetchPatientData = async () => {
            try {
                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching patient data:", err);
            }
        };

        fetchPatientData();
    }, []);

    const columns = [
        { Header: "Timestamp", accessor: "timestamp" },
        { Header: "Blood Pressure", accessor: "bloodPressure" },
        { Header: "BMI", accessor: "bmi" },
        { Header: "Diabetes Risk", accessor: "diabetesRisk" },
    ];

    const handleRowClick = (row) => {
        console.log("Row clicked:", row);
    };

    if (!data) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <Container maxWidth={false} style={styles.container}>
            <Grid container spacing={3}>
                <Grid item md={12}>
                    <Typography variant="h1" component="h1" style={styles.header}>
                        Patient Data
                    </Typography>

                    {error && <p style={{ color: "red" }}>Error: {error}</p>}

                    {/* Render BasicTable */}
                    <BasicTable columns={columns} data={data} onRowClick={handleRowClick} />
                </Grid>
            </Grid>
        </Container>
    );
}

// Styling for the layout
const styles = {
    container: {
        display: 'flex',
        background: '#f4f4f4',
        alignItems: 'center',
        width: '90%',
    },
    header: {
        marginBottom: '2%',
    },
};

export default Home;
