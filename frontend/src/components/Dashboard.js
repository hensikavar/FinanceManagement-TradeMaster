import React, { useEffect, useState } from 'react';
import { AgChartsReact } from 'ag-charts-react';
import "./Dashboard.css";

const Dashboard = () => {
  const [paymentInData, setPaymentInData] = useState([]);
  const [paymentOutData, setPaymentOutData] = useState([]);

  useEffect(() => {
    fetchPaymentinData();
    fetchPaymentoutData();
  }, []);

  const fetchPaymentinData = () => {
    fetch("http://localhost:5000/paymentin")
      .then(res => res.json())
      .then(data => setPaymentInData(data))
      .catch(error => console.error('Error fetching payment in data:', error));
  };

  const fetchPaymentoutData = () => {
    fetch("http://localhost:5000/paymentout")
      .then(res => res.json())
      .then(data => setPaymentOutData(data))
      .catch(error => console.error('Error fetching payment out data:', error));
  };

  const calculateNetProfit = (paymentIn, paymentOut) => {
    const netProfitData = {};
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Initialize net profit data for all 12 months
    for (let i = 0; i < 12; i++) {
        const monthYear = `${currentYear}-${i}`;
        netProfitData[monthYear] = 0;
    }

    // Loop through payment in data and calculate total payment in for each month
    paymentIn.forEach(payment => {
        const date = new Date(payment.payin_date);
        const monthYear = `${date.getFullYear()}-${date.getMonth()}`;

        if (date >= new Date(currentYear, currentMonth - 11, 1)) {
            netProfitData[monthYear] += payment.payin_total_amt;
        }
    });

    // Loop through payment out data and subtract total payment out for each month
    paymentOut.forEach(payment => {
        const date = new Date(payment.payout_date);
        const monthYear = `${date.getFullYear()}-${date.getMonth()}`;

        if (date >= new Date(currentYear, currentMonth - 11, 1)) {
            netProfitData[monthYear] -= payment.payout_total_amt; // Subtract payment out from payment in
        }
    });

    return Object.entries(netProfitData).map(([monthYear, netProfit]) => ({
        monthYear,
        netProfit
    }));
};


  const formatDate = (dateString) => {
    const [year, month] = dateString.split('-');
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${monthNames[parseInt(month, 10)]}-${year}`;
  };
  
  const netProfitData = calculateNetProfit(paymentInData, paymentOutData).map(item => ({
    ...item,
    monthYear: formatDate(item.monthYear)
  }));

  const chartOptions = {
    data: netProfitData,
    series: [{
      xKey: 'monthYear',
      yKey: 'netProfit',
      title: 'Net Profit',
      type: 'line',
      marker: { size: 6 }, // Set the size of the marker points
      stroke: '#8884d8', // Set line color
      fill: '#8884d8' // Set area fill color
    }],
    xAxis: {
      title: { text: 'Month-Year' }
    },
    yAxis: {
      title: { text: 'Net Profit' }
    },
    legend: {
      enabled: false // Disable legend
    },
    title: {
      text: 'Net Profit Over the Last 12 Months', // Set chart title
      fontSize: 18,
      fontWeight: 'bold',
      color: '#3f228f'
    },
    subtitle: {
      text: 'Source: Your Data Source', // Set subtitle
      fontSize: 14,
      color: '#555555'
    },
    padding: {
      top: 20,
      right: 30,
      bottom: 50,
      left: 60
    }
  };
  

  return (
    <div className='dashboard'>
      <div className='container'>
        <h1 className='dashboard-title'>Financial Insights Dashboard</h1>
        <p className='dashboard-description'>Unlocking insights to drive smarter decisions</p>
        <div className='chart-container'>
          <AgChartsReact options={chartOptions} />
         
        </div>
        <p className='footer-text'>Discover the power of visualization in understanding your finances.</p>
      </div>
    </div>
  );
};

export default Dashboard;
