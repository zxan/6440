import React, { useEffect, useState } from "react";
import { plotBmiHistogram, plotBmiVsBloodPressureScatter, plotDiabetesRiskPieChart } from './utils';

const Charts = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const apiUrl = "https://xq6okx5rca.execute-api.us-east-1.amazonaws.com/prod/healthdata";

  useEffect(() => {
    const fetchHealthData = async () => {
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
        console.error("Error fetching health data:", err);
      }
    };

    fetchHealthData();
  }, []);

  useEffect(() => {
    if (data) {
      // Generate charts only after data is available and DOM is updated
      plotBmiHistogram(data);
      plotBmiVsBloodPressureScatter(data);
      plotDiabetesRiskPieChart(data);
    }
  }, [data]);

  return (
    <div>
      <h1>Health Data Charts</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {data ? (
        <>
          <h2>Charts</h2>
          <canvas id="bmiHistogram" width="10" height="10"></canvas>
          <canvas id="bmiVsBloodPressure" width="10" height="10"></canvas>
          <canvas id="diabetesRiskPieChart" width="10" height="10"></canvas>
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default Charts;
