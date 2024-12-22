import { Chart as ChartJS, 
  CategoryScale, LinearScale, BarElement, 
  PointElement, LineElement, Title, Tooltip, 
  Legend, ArcElement, BarController, ScatterController, PieController } from 'chart.js';

// Registering all required components including PieController for pie charts
ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
PointElement,
LineElement,
Title,
Tooltip,
Legend,
ArcElement,  // for pie chart
BarController, // for bar charts
ScatterController, // for scatter plots
PieController // for pie charts
);

// Function to calculate average BMI
export const calculateAverageBmi = (data) => {
const totalBmi = data.reduce((acc, item) => acc + item.bmi, 0);
return totalBmi / data.length;
};

// Function to calculate average blood pressure
export const calculateAverageBloodPressure = (data) => {
const totalSystolic = data.reduce((acc, item) => acc + parseInt(item.bloodPressure.split('/')[0], 10), 0);
const totalDiastolic = data.reduce((acc, item) => acc + parseInt(item.bloodPressure.split('/')[1], 10), 0);

const avgSystolic = totalSystolic / data.length;
const avgDiastolic = totalDiastolic / data.length;

return { avgSystolic, avgDiastolic };
};

// Function to calculate diabetes risk distribution
export const calculateDiabetesRiskDistribution = (data) => {
const riskDistribution = { Low: 0, Moderate: 0, High: 0 };

data.forEach(item => {
if (item.diabetesRisk === "Low") riskDistribution.Low++;
if (item.diabetesRisk === "Moderate") riskDistribution.Moderate++;
if (item.diabetesRisk === "High") riskDistribution.High++;
});

return riskDistribution;
};

// Function to destroy a previous chart if it exists
const destroyChart = (chartId) => {
const existingChart = ChartJS.getChart(chartId);
if (existingChart) {
existingChart.destroy();
}
};

// Example: Histogram for BMI
export const plotBmiHistogram = (data) => {
  const ctx = document.getElementById('bmiHistogram').getContext('2d');

  // Destroy any existing chart before creating a new one
  destroyChart('bmiHistogram');

  // Calculate frequency of BMI values by binning them into ranges
  const bmiData = data.map(item => item.bmi);
  
  // Define the BMI bins
  const bins = [10, 15, 20, 25, 30, 35, 40];
  const frequency = new Array(bins.length - 1).fill(0); // Create a frequency array with 0 values
  
  // Calculate frequencies by checking where each BMI falls in the bin range
  bmiData.forEach(bmi => {
    for (let i = 0; i < bins.length - 1; i++) {
      if (bmi >= bins[i] && bmi < bins[i + 1]) {
        frequency[i]++;
        break;
      }
    }
  });

  // Create the chart using the frequency data
  new ChartJS(ctx, {
    type: 'bar',
    data: {
      labels: bins.slice(0, -1).map((bin, index) => `${bin} - ${bins[index + 1]}`), // Bin ranges for x-axis labels
      datasets: [{
        label: 'BMI Distribution',
        data: frequency, // Frequency for each BMI bin
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }],
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'BMI Range',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Frequency',
          },
        },
      },
    },
  });
};


// Example: Scatter Plot for BMI vs Blood Pressure
export const plotBmiVsBloodPressureScatter = (data) => {
const ctx = document.getElementById('bmiVsBloodPressure').getContext('2d');

// Destroy any existing chart before creating a new one
destroyChart('bmiVsBloodPressure');

const bmiData = data.map(item => item.bmi);
const systolicData = data.map(item => parseInt(item.bloodPressure.split('/')[0], 10));

new ChartJS(ctx, {
type: 'scatter',
data: {
datasets: [{
 label: 'BMI vs Systolic BP',
 data: bmiData.map((bmi, index) => ({ x: bmi, y: systolicData[index] })),
 backgroundColor: 'rgba(153, 102, 255, 1)',
 borderColor: 'rgba(153, 102, 255, 1)',
 borderWidth: 1,
 pointRadius: 5,
}],
},
options: {
scales: {
 x: {
   title: {
     display: true,
     text: 'BMI',
   },
 },
 y: {
   title: {
     display: true,
     text: 'Systolic BP',
   },
 },
},
},
});
};

// Example: Pie Chart for Diabetes Risk Distribution
export const plotDiabetesRiskPieChart = (data) => {
const ctx = document.getElementById('diabetesRiskPieChart').getContext('2d');

// Destroy any existing chart before creating a new one
destroyChart('diabetesRiskPieChart');

const riskDistribution = calculateDiabetesRiskDistribution(data);

new ChartJS(ctx, {
type: 'pie',
data: {
labels: ['Low', 'Moderate', 'High'],
datasets: [{
 label: 'Diabetes Risk Distribution',
 data: [riskDistribution.Low, riskDistribution.Moderate, riskDistribution.High],
 backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 99, 132, 0.2)'],
 borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 1)'],
 borderWidth: 1,
}],
},
options: {
responsive: true,
},
});
};
