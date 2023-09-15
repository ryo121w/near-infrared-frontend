import React, { useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const BASE_API_URL = "http://localhost:8000/";

const FileUploadComponent = ({ setFile }) => {
const handleFileChange = (e) => {
    setFile(e.target.files[0]);
};

return (
    <div>
    <input type="file" onChange={handleFileChange} />
    </div>
);
};

const SpectrumGraphComponent = ({ data }) => {
return <Plot data={data} />;
};

const NumericalResultsComponent = ({ results }) => {
    return (
      <div>
        <h2>Numerical Results</h2>
        {Object.keys(results).map((key) => (
          <div key={key}>
            <strong>{key}</strong>: {`Integral: ${results[key].integral}, Error: ${results[key].error}`}
          </div>
        ))}
      </div>
    );
  };

const GaussianIntegral = () => {
const [file, setFile] = useState(null);
const [graphData, setGraphData] = useState([]);
const [numericalResults, setNumericalResults] = useState([]);

const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('data_file', file);

    try {
    const response = await axios.post(`${BASE_API_URL}api/gaussian/`, formData);
    const { graph, results } = response.data;
    
    setGraphData(graph);
    setNumericalResults(results);
    } catch (error) {
    console.error("Error:", error);
    }
};

return (
    <div>
    <FileUploadComponent setFile={setFile} />
    <button onClick={handleSubmit}>Submit</button>
    <SpectrumGraphComponent data={graphData} />
    <NumericalResultsComponent results={numericalResults} />
    </div>
);
};

export default GaussianIntegral;
