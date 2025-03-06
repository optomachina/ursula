import { useState, useEffect } from 'react';
import './App.css';
import { FileUpload, Dashboard } from './components';

function App() {
  const [currentFile, setCurrentFile] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Load history from localStorage on initial render
  useEffect(() => {
    const savedHistory = localStorage.getItem('uploadHistory');
    if (savedHistory) {
      try {
        setUploadHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse upload history:', error);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (uploadHistory.length > 0) {
      localStorage.setItem('uploadHistory', JSON.stringify(uploadHistory));
    }
  }, [uploadHistory]);

  // Handle file processing
  const handleFileProcessed = (historyItem) => {
    // Update current file and processed data
    setCurrentFile(historyItem.file);
    setProcessedData(historyItem.data);
    
    // Add to history (limit to 50 items)
    setUploadHistory(prevHistory => {
      const newHistory = [historyItem, ...prevHistory];
      return newHistory.slice(0, 50);
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            URSULA Chat Analyzer
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Universal Resource for Speech, Understanding, and Linguistic Analysis
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex">
        {/* Sidebar */}
        <aside 
          className={`w-64 bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 fixed md:static h-full z-10`}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Upload History</h2>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ×
            </button>
          </div>
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
            {uploadHistory.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No upload history yet</p>
            ) : (
              <ul className="space-y-2">
                {uploadHistory.map((item, index) => (
                  <li 
                    key={index}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                    onClick={() => {
                      setCurrentFile(item.file);
                      setProcessedData(item.data);
                    }}
                  >
                    <p className="font-medium truncate">{item.file.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.data?.conversations || 0} conversations
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-8">
          {/* Toggle Sidebar Button (Mobile) */}
          <button
            className="md:hidden mb-4 p-2 bg-white dark:bg-gray-800 rounded shadow"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            {!processedData ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold mb-4">Upload Chat Data</h2>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  Drag and drop a CSV file or click to select
                </p>
                <div className="max-w-xl mx-auto">
                  <FileUpload onFileProcessed={handleFileProcessed} />
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">Analysis Dashboard</h2>
                <Dashboard data={processedData} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
