// index.js

// Load environment variables from .env file
require('dotenv').config();

const mysql = require('mysql2/promise');

async function fetchData() {
  try {
    // Create a connection to the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Execute the SQL query
    const [rows, fields] = await connection.execute(`
      SELECT 
        YearStart,
        YearEnd,
        LocationAbbr,
        LocationDesc,
        Datasource,
        Class,
        Topic,
        Question,
        Data_Value_Unit,
        Data_Value_Type,
        Data_Value,
        Low_Confidence_Limit,
        High_Confidence_Limit,
        Sample_Size,
        Age_years,
        Education,
        Gender,
        Income,
        Race_Ethnicity,
        GeoLocation,
        StratificationCategory1,
        Stratification1
      FROM your_table_name;
    `);

    // Close the database connection
    await connection.end();

    // Output the data
    console.log(rows);

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Call the fetchData function
fetchData();
