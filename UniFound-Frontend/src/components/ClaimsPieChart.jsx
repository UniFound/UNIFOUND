import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale);

const ClaimsPieChart = () => {
  const [claimsData, setClaimsData] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
    underReview: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaimsData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/claims');
        const data = await response.json();
        
        if (data && Array.isArray(data)) {
          const total = data.length;
          const verified = data.filter(claim => claim.status === 'Approved').length;
          const pending = data.filter(claim => claim.status === 'Pending').length;
          const rejected = data.filter(claim => claim.status === 'Rejected').length;
          const underReview = data.filter(claim => claim.status === 'Under Review').length;

          setClaimsData({
            total,
            verified,
            pending,
            rejected,
            underReview
          });
        }
      } catch (error) {
        console.error('Error fetching claims data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaimsData();
  }, []);

  const chartData = {
    labels: ['Verified Claims', 'Pending Claims', 'Under Review', 'Rejected Claims'],
    datasets: [
      {
        data: [claimsData.verified, claimsData.pending, claimsData.underReview, claimsData.rejected],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',  // emerald-500
          'rgba(59, 130, 246, 0.8)', // blue-500
          'rgba(251, 146, 60, 0.8)', // orange-400
          'rgba(239, 68, 68, 0.8)',  // red-500
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(251, 146, 60, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '600',
            family: "'Inter', sans-serif"
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              const dataset = data.datasets[0];
              const total = dataset.data.reduce((a, b) => a + b, 0);
              return data.labels.map((label, i) => {
                const value = dataset.data[i];
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return {
                  text: `${label}: ${value} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor[i],
                  lineWidth: dataset.borderWidth,
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1000,
      easing: 'easeInOutQuart'
    }
  };

  if (loading) {
    return (
      <div className="h-[340px] bg-slate-50/50 rounded-[24px] border border-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium text-sm">Loading claims data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[340px] bg-slate-50/50 rounded-[24px] border border-slate-100 p-6">
      <div className="h-full flex flex-col">
        <div className="flex-1 relative">
          <Pie data={chartData} options={options} />
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-slate-900">{claimsData.total}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Total Claims</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{claimsData.verified}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Verified Claims</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimsPieChart;
