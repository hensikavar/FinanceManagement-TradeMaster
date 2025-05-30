import React from 'react'
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import "./Charts.css"


const Charts = () => {
    const chartRef = useRef(null);

    useEffect(() => {
      // Dummy data for expenses and sales
      const expensesData = [2000, 1500, 1800, 1200, 2500];
      const salesData = [3000, 2500, 2800, 2200, 3500];
  
      // Create a new Chart instance
      const myChart = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [
            {
              label: 'Expenses',
              data: expensesData,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
            {
              label: 'Sales',
              data: salesData,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
          ],
        },
        // options: {
        //     maintainAspectRatio: false, // Allow the chart to adjust to the canvas size
        //   },
      });
      
  
      // Cleanup function to destroy the chart when the component unmounts
      return () => {
        myChart.destroy();
      };
    }, []);
  return (
    <div>
      <div className="financial-dashboard">
        <div className='lable'>Sales vs Expenses</div>
        <canvas ref={chartRef} width="50" height="50"></canvas>
      </div>
    </div>
  )
}

export default Charts
