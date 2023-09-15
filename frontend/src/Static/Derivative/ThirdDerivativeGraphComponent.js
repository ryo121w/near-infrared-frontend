import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ThirdDerivativeGraphComponent.css';
import '../css/ThirdLoadButton.css';
import styles from '../css/Bento.module.css'

const BASE_API_URL = process.env.REACT_APP_API_ENDPOINT;

const ThirdDerivativeGraphComponent = () => {
    const [graphUrl, setGraphUrl] = useState(null);
    const [savedFilePath, setSavedFilePath] = useState(null);
    const [fileSaved, setFileSaved] = useState(false);
    const [showCalculator, setShowCalculator] = useState(false); // New state
    const [showSecondCalculator, setShowSecondCalculator] = useState(false); // New state
    const [showGraph, setShowGraph] = useState(false); // 追加

    useEffect(() => {
        const fetchSavedFilePath = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}api/get_saved_file_path/`);
                if (response.data && response.data.file_path) {
                    setSavedFilePath(response.data.file_path);
                }
            } catch (error) {
                console.error("Error fetching saved file path:", error);
            }
        };

        if (fileSaved) {
            fetchSavedFilePath();
            setFileSaved(false);
        }
    }, [fileSaved]);

    const handleFileSaved = () => {
        setFileSaved(true);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!savedFilePath) {
            console.error("Saved file path is not set. Cannot proceed.");
            return;
        }
        try {
            const postData = { file_path: savedFilePath };
            const response = await axios.post(`${BASE_API_URL}api/third_derivative_graph/`, postData);
            if (response.data && response.data.graph_url) {
                const newGraphUrl = `${BASE_API_URL}${response.data.graph_url}`;
                setGraphUrl(newGraphUrl);
            }
            setShowGraph(true);
            setShowCalculator(true);
            setShowSecondCalculator(true);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const onSave = async () => {
        try {
            const postData = { file_path: savedFilePath };
            await axios.post(`${BASE_API_URL}api/save_third_derivative_data/`, postData);
            const downloadUrl = `${BASE_API_URL}api/download_third_derivative_data/`;
            const blobResponse = await axios.get(downloadUrl, { responseType: 'blob' });
            const blob = new Blob([blobResponse.data], { type: 'application/vnd.ms-excel' });
            const blobURL = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobURL;
            link.download = 'third_derivative_data.xlsx';
            link.click();
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to save file");
        }
    };

    return (
        <div className="Main-Wrapper">
            <div className="Second-Title-Button-Container">
                <h5 className="Second-Title">三次微分</h5>
                <form onSubmit={onSubmit}>
                    <button className="unique-button" type="submit">
                        <span className="span-mother">
                            <span>G</span><span>e</span><span>n</span><span>e</span>
                            <span>r</span><span>a</span><span>t</span><span>e</span>
                        </span>
                        <span className="span-mother2">
                            <span>G</span><span>e</span><span>n</span><span>e</span>
                            <span>r</span><span>a</span><span>t</span><span>e</span>
                        </span>
                    </button>
                </form>
                <button className="Second-button" type="button" onClick={handleFileSaved}>
                    <span className="Second-button__text">Load</span>
                    <span className="Second-button__icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" id="bdd05811-e15d-428c-bb53-8661459f9307" data-name="Layer 2" class="Second-svg">
                            <path d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z"></path>
                            <path d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z"></path>
                            <path d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z"></path>
                        </svg>
                    </span>
                </button>
                <a href="#" onClick={onSave}>
                    <img className="floppy_save_icon" src="/0LcLFKJ29rp8yCa1693870439_1693870449.png" alt="Save as Excel File" />
                </a>
            </div>
            <div className={styles['Graph-right-side']}>
                <div className={`${styles['Bento_NIRGraph']} ${showGraph ? styles['show-element'] : ''}`}>
                    {graphUrl && <img className={styles['NIRGraph']} src={graphUrl} alt="Corrected NIR Spectrum" />}
                </div>
                <div className={styles['Calculator-container']}>
                    <div className={`${styles['Bento_NIRGraph_Calculator']} ${showCalculator ? styles['show-calculator'] : ''}`}>
                        {/* Calculator content */}
                    </div>
                    <div className={`${styles['Bento_NIRGraph_Second_Calculator']} ${showSecondCalculator ? styles['show-second_calculator'] : ''}`}>
                        {/* Second calculator content */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThirdDerivativeGraphComponent;
