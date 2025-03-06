# URSULA Chat Analyzer

URSULA (Universal Resource for Speech, Understanding, and Linguistic Analysis) is a web application designed to analyze customer chat data. It provides insights into customer issues, feature requests, and sentiment analysis.

## Features

- **File Input Interface**: Drag-and-drop zone for CSV file uploads with paste functionality
- **Dashboard View**: Data visualization for top customer issues, feature requests, sentiment analysis
- **History Sidebar**: Collapsible sidebar showing previous uploads (limited to 50)
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Export Functionality**: Export analyzed data in CSV or JSON format
- **Local Storage**: History persistence across sessions

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

### Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000

### Building for Production

To build the application for production:

```bash
npm run build
```

The build files will be available in the `dist` directory.

## Usage

1. **Upload a CSV File**: Drag and drop a CSV file onto the upload area, or click to select a file. You can also paste CSV content directly into the text area.
2. **View Analysis**: After uploading, the dashboard will display various visualizations of the data:
   - Top customer issues
   - Feature requests
   - Sentiment analysis
   - Key metrics
3. **Export Data**: Use the export buttons to download the analyzed data in CSV or JSON format.
4. **View History**: The sidebar shows previous uploads. Click on an item to view its analysis again.

## CSV Format

The application expects CSV files with the following columns:

- `ChatLogID`: Unique identifier for each conversation
- `UserType`: Type of user (e.g., "agent", "visitor")
- `AuthorName`: Name of the message author
- `AgentID`: Identifier for the agent (if applicable)
- `MessageText`: The content of the message
- `SentDate`: Date and time when the message was sent

## Technologies Used

- React
- Tailwind CSS
- Chart.js
- Papa Parse (for CSV parsing)
- react-dropzone (for file uploads)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
