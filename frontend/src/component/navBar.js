import * as React from 'react';
import { AppBar, Button, Box, Container, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const navItems = [
    { name: 'Patients', path: '/Patients' },
    { name: 'Charts', path: '/Charts' },
    { name: 'Health Data Prediction', path: '/HealthDataPrediction' },
];

const styles = {
    logoIcon: {
        fontSize: '2rem',
        marginRight: '10px',
        color: '#fff',
    },
    logoText: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#fff',
        textDecoration: 'none',
        marginRight: '2rem',
    },
    linkButton: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '1rem',
        marginLeft: '1rem',
    },
    appBar: {
        padding: '0.7rem',
        backgroundColor: '#FF9130',
    },
};

export default function NavBar() {
    return (
        <Box sx={{ width: '100%' }}>
            <AppBar style={styles.appBar} position="static">
                <Container maxWidth="xl">
                    <Toolbar>
                        <Typography
                            component="a"
                            href="/"
                            style={styles.logoText}
                        >
                            BuzzHealth
                        </Typography>

                        {/* Dynamically render nav items */}
                        {navItems.map((item) => (
                            <Button key={item.name}>
                                <Link to={item.path} style={styles.linkButton}>
                                    {item.name}
                                </Link>
                            </Button>
                        ))}
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    );
}
