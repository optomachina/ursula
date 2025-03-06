import { useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const Dashboard = ({ data, onExport }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!data) return null;

  // Prepare data for charts
  const topIssuesData = {
    labels: data.topIssues.map(issue => issue.issue),
    datasets: [
      {
        label: 'Frequency',
        data: data.topIssues.map(issue => issue.count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const topIssuesOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Top Customer Issues',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Frequency',
        },
      },
    },
  };

  const sentimentData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [
          data.sentiment.positive,
          data.sentiment.neutral,
          data.sentiment.negative,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const sentimentOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Sentiment Distribution',
        font: {
          size: 16,
        },
      },
    },
  };

  // Feature requests data
  const featureRequestsData = {
    labels: data.featureRequests.map(feature => {
      // Truncate long feature descriptions
      const text = feature.feature;
      return text.length > 30 ? text.substring(0, 30) + '...' : text;
    }),
    datasets: [
      {
        label: 'Frequency',
        data: data.featureRequests.map(feature => feature.count),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const featureRequestsOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Feature Requests',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const feature = data.featureRequests[index].feature;
            return `${feature}: ${context.parsed.x}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Frequency',
        },
      },
    },
  };

  // Create a mock timeline for sentiment (in a real app, this would use actual timestamps)
  const timelineLabels = Array.from({ length: 10 }, (_, i) => `Day ${i + 1}`);
  
  // Generate mock sentiment data points (in a real app, this would be calculated from actual data)
  const positiveLine = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10) + 5);
  const neutralLine = Array.from({ length: 10 }, () => Math.floor(Math.random() * 8) + 3);
  const negativeLine = Array.from({ length: 10 }, () => Math.floor(Math.random() * 6) + 1);

  const sentimentTimelineData = {
    labels: timelineLabels,
    datasets: [
      {
        label: 'Positive',
        data: positiveLine,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Neutral',
        data: neutralLine,
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Negative',
        data: negativeLine,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const sentimentTimelineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Sentiment Timeline',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Message Count',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Time Period',
        },
      },
    },
  };

  // Calculate message distribution by user type
  const userTypeLabels = Object.keys(data.messagesByUserType);
  const userTypeData = userTypeLabels.map(type => data.messagesByUserType[type]);

  const messageDistributionData = {
    labels: userTypeLabels,
    datasets: [
      {
        label: 'Messages',
        data: userTypeData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const messageDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Message Distribution by User Type',
        font: {
          size: 16,
        },
      },
    },
  };

  // Handle export
  const handleExport = (format) => {
    if (format === 'json') {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chat-analysis.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      // Convert to CSV
      const headers = ['Category', 'Value'];
      let csvContent = headers.join(',') + '\n';
      
      // Add key metrics
      csvContent += `Total Conversations,${data.conversations}\n`;
      csvContent += `Total Messages,${data.totalMessages}\n`;
      
      // Add sentiment data
      csvContent += `Positive Sentiment,${data.sentiment.positive}\n`;
      csvContent += `Neutral Sentiment,${data.sentiment.neutral}\n`;
      csvContent += `Negative Sentiment,${data.sentiment.negative}\n`;
      
      // Add top issues
      data.topIssues.forEach(issue => {
        csvContent += `Issue: ${issue.issue},${issue.count}\n`;
      });
      
      // Add feature requests
      data.featureRequests.forEach(feature => {
        csvContent += `Feature: ${feature.feature},${feature.count}\n`;
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chat-analysis.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="w-full">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Conversations</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.conversations}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Messages</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.totalMessages}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Sentiment Ratio</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {Math.round((data.sentiment.positive / (data.sentiment.positive + data.sentiment.negative + data.sentiment.neutral)) * 100)}%
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">positive</span>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('issues')}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'issues'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Customer Issues
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'features'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Feature Requests
          </button>
          <button
            onClick={() => setActiveTab('sentiment')}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'sentiment'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Sentiment Analysis
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mb-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-80">
              <Bar data={topIssuesData} options={topIssuesOptions} />
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-80">
              <Pie data={sentimentData} options={sentimentOptions} />
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-80 md:col-span-2">
              <Line data={sentimentTimelineData} options={sentimentTimelineOptions} />
            </div>
          </div>
        )}

        {activeTab === 'issues' && (
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-96">
              <Bar data={topIssuesData} options={topIssuesOptions} />
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Top Issues Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Issue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Frequency</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.topIssues.map((issue, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{issue.issue}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{issue.count}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {Math.round((issue.count / data.totalMessages) * 100)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-96">
              <Bar data={featureRequestsData} options={featureRequestsOptions} />
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Feature Requests Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Feature Request</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Frequency</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.featureRequests.map((feature, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{feature.feature}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{feature.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sentiment' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-80">
              <Pie data={sentimentData} options={sentimentOptions} />
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-80">
              <Pie data={messageDistributionData} options={messageDistributionOptions} />
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-80 md:col-span-2">
              <Line data={sentimentTimelineData} options={sentimentTimelineOptions} />
            </div>
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="flex justify-end space-x-2 mt-6">
        <button
          onClick={() => handleExport('csv')}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Export CSV
        </button>
        <button
          onClick={() => handleExport('json')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Export JSON
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
