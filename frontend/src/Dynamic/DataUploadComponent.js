import React from 'react';
import axios from 'axios';

const BASE_API_URL = process.env.REACT_APP_API_ENDPOINT;

export const DataUpload = ({ setData }) => {
    const onFileChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${BASE_API_URL}api/dynamic_graph`, formData);
            setData(response.data);
        } catch (error) {
            console.error("Error uploading the file:", error);
        }
    };

    return (
        <div>
            <label htmlFor="fileInput">ファイルを選択:</label>
            <input type="file" id="fileInput" onChange={onFileChange} />
        </div>
    );
};

export default DataUpload;