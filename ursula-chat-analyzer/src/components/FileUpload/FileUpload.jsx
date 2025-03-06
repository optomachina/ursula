import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const FileUpload = ({ onFileProcessed }) => {
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const textAreaRef = useRef(null);

  const validateFile = (file) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds the 10MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
      return false;
    }

    // Check file type (must be CSV)
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setError('Only CSV files are supported');
      return false;
    }

    setError(null);
    return true;
  };

  const processCSV = (file) => {
    setIsProcessing(true);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError(`Error parsing CSV: ${results.errors[0].message}`);
          setIsProcessing(false);
          return;
        }

        try {
          // Process the data
          const processedData = analyzeData(results.data);
          
          // Create a history item
          const historyItem = {
            file: file,
            timestamp: new Date().toISOString(),
            data: processedData
          };
          
          // Call the callback with the processed data
          onFileProcessed(historyItem);
          setIsProcessing(false);
        } catch (error) {
          setError(`Error processing data: ${error.message}`);
          setIsProcessing(false);
        }
      },
      error: (error) => {
        setError(`Error parsing CSV: ${error.message}`);
        setIsProcessing(false);
      }
    });
  };

  const analyzeData = (data) => {
    // Group by ChatLogID to identify conversations
    const conversations = data.reduce((acc, row) => {
      const chatId = row.ChatLogID;
      if (!acc[chatId]) {
        acc[chatId] = [];
      }
      acc[chatId].push(row);
      return acc;
    }, {});

    // Count messages by user type
    const messagesByUserType = data.reduce((acc, row) => {
      const userType = row.UserType || 'unknown';
      acc[userType] = (acc[userType] || 0) + 1;
      return acc;
    }, {});

    // Extract top issues (simplified approach - in a real app, this would use NLP)
    // Here we're just counting keywords in visitor messages
    const issueKeywords = [
      'error', 'problem', 'issue', 'broken', 'doesn\'t work', 
      'failed', 'bug', 'wrong', 'incorrect', 'not working'
    ];
    
    const topIssues = {};
    data.forEach(row => {
      if (row.UserType === 'visitor' && row.MessageText) {
        const text = row.MessageText.toLowerCase();
        issueKeywords.forEach(keyword => {
          if (text.includes(keyword)) {
            topIssues[keyword] = (topIssues[keyword] || 0) + 1;
          }
        });
      }
    });

    // Sort issues by frequency
    const sortedIssues = Object.entries(topIssues)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([issue, count]) => ({ issue, count }));

    // Simple sentiment analysis (very basic approach)
    const positiveWords = ['good', 'great', 'excellent', 'thank', 'thanks', 'helpful', 'appreciate'];
    const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'unhelpful', 'disappointed'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;
    
    data.forEach(row => {
      if (row.MessageText) {
        const text = row.MessageText.toLowerCase();
        let isPositive = false;
        let isNegative = false;
        
        positiveWords.forEach(word => {
          if (text.includes(word)) isPositive = true;
        });
        
        negativeWords.forEach(word => {
          if (text.includes(word)) isNegative = true;
        });
        
        if (isPositive && !isNegative) positiveCount++;
        else if (isNegative && !isPositive) negativeCount++;
        else neutralCount++;
      }
    });

    // Feature requests (simplified approach)
    const featureKeywords = [
      'feature', 'add', 'would like', 'could you', 'should have', 
      'missing', 'need', 'want', 'request', 'improve'
    ];
    
    const featureRequests = {};
    data.forEach(row => {
      if (row.UserType === 'visitor' && row.MessageText) {
        const text = row.MessageText.toLowerCase();
        featureKeywords.forEach(keyword => {
          if (text.includes(keyword)) {
            // Extract the sentence containing the keyword
            const sentences = text.split(/[.!?]+/);
            const relevantSentence = sentences.find(s => s.includes(keyword)) || text;
            featureRequests[relevantSentence.trim()] = (featureRequests[relevantSentence.trim()] || 0) + 1;
          }
        });
      }
    });

    // Sort feature requests by frequency
    const sortedFeatures = Object.entries(featureRequests)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([feature, count]) => ({ feature, count }));

    // Return the processed data
    return {
      conversations: Object.keys(conversations).length,
      totalMessages: data.length,
      messagesByUserType,
      topIssues: sortedIssues,
      featureRequests: sortedFeatures,
      sentiment: {
        positive: positiveCount,
        negative: negativeCount,
        neutral: neutralCount
      },
      rawData: data
    };
  };

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    if (validateFile(file)) {
      processCSV(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false)
  });

  const handlePaste = useCallback((e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData('text');
    
    if (!pastedText) return;
    
    // Create a file from the pasted text
    const file = new File([pastedText], 'pasted-data.csv', { type: 'text/csv' });
    
    if (validateFile(file)) {
      processCSV(file);
    }
  }, []);

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          }`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {isDragActive ? 'Drop the file here' : 'Drag & drop a CSV file here'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              or click to select a file
            </p>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>Supported format: CSV</p>
            <p>Maximum size: 10MB</p>
          </div>
        </div>
      </div>

      {/* Paste Area */}
      <div className="mt-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          Or paste CSV content directly:
        </p>
        <textarea
          ref={textAreaRef}
          onPaste={handlePaste}
          className="w-full h-24 p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200"
          placeholder="Paste CSV content here..."
        ></textarea>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-sm">Processing file...</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
