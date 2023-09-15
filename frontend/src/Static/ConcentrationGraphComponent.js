import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useExcelData } from './ExcelDataContext';
import { useSavedFilePath } from './SavedFilePathContext';
import styles from './css/ConcentrationGraphComponent.module.css';
import './css/ConcentrationGraphLoader.css';
import './css/Button.css'

const BASE_API_URL = process.env.REACT_APP_API_ENDPOINT;

function ConcentrationGraphComponent({ graphConcentrations }) {
    const { excelFile, excelConcentrations, setExcelConcentrations } = useExcelData();
    const { savedFilePath, setSavedFilePath } = useSavedFilePath();  // <-- この行を追加
    const [graphUrl, setGraphUrl] = useState(null);
    const [concentrations, setConcentrations] = useState({});
    const [showCalculator, setShowCalculator] = useState(false); // New state
    const [showSecondCalculator, setShowSecondCalculator] = useState(false); // New state
    const [showGraph, setShowGraph] = useState(false); // 追加

    useEffect(() => {
        console.log("Current value of excelConcentrations:", JSON.stringify(excelConcentrations));
        console.log("Current value of concentrations:", JSON.stringify(concentrations));
    }, [excelConcentrations, concentrations]);

    useEffect(() => {
        if (graphConcentrations && graphConcentrations.length > 0) {
            const newConcentrations = {};
            excelConcentrations.forEach((molarity, index) => {
                newConcentrations[molarity] = graphConcentrations[index];
            });
            setConcentrations(newConcentrations);
        }
    }, [graphConcentrations]);

    const handleConcentrationChange = (e, molarity) => {
        const newConcentrations = {
            ...concentrations,
            [molarity]: e.target.value,
        };
        console.log("Setting new concentrations:", newConcentrations);
        setConcentrations(newConcentrations);
    };

    const onSubmit = async () => {
        const formData = new FormData();

        console.log("Before appending data to FormData:", formData);
        formData.append('file', excelFile);
        Object.values(concentrations).forEach(concentration => {
            formData.append('concentrations[]', concentration);
        });
        console.log("After appending data to FormData:", formData);

        try {
            const saveEndpoint = `${BASE_API_URL}/api/save_molar_absorptivity/`;
            const saveResponse = await axios.post(saveEndpoint, formData);
            console.log("Received saveResponse:", saveResponse.data);
            console.log("Received saveResponse status:", saveResponse.status);
            console.log("Full saveResponse data:", saveResponse.data);

            const savedFilePath = saveResponse.data.file_path;

            if (saveResponse.data.file_saved) {
                console.log("File successfully saved.");
                setSavedFilePath(savedFilePath);  // <-- この行を追加
                console.log("SavedFilePath after setting:", savedFilePath);
            } else {
                console.error(`File saving failed: ${saveResponse.data.error || 'No error message available'}`);
            }

            const graphEndpoint = `${BASE_API_URL}/api/concentration_graph/`;
            const graphResponse = await axios.post(graphEndpoint, formData);
            if (graphResponse.data && graphResponse.data.graph_url) {
                setGraphUrl(BASE_API_URL + graphResponse.data.graph_url);
            }
            setShowGraph(true);
            setShowCalculator(true);
            setShowSecondCalculator(true);
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    const excelConcentrationsArray = Array.isArray(excelConcentrations) ? excelConcentrations : Object.keys(excelConcentrations);

    if (!excelConcentrationsArray.length) {
        return <div className="Loader">
            <svg class="pl" width="240" height="240" viewBox="0 0 240 240">
                <circle class="pl__ring pl__ring--a" cx="120" cy="120" r="105" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 660" stroke-dashoffset="-330" stroke-linecap="round"></circle>
                <circle class="pl__ring pl__ring--b" cx="120" cy="120" r="35" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 220" stroke-dashoffset="-110" stroke-linecap="round"></circle>
                <circle class="pl__ring pl__ring--c" cx="85" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
                <circle class="pl__ring pl__ring--d" cx="155" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
            </svg>
        </div>;
    }

    return (
        <div className={styles['Molar-Component-Wrapper']}>
            <div className={styles['graph-concentration-container']}>
                <div className={styles['concentration-container']}>
                    <h5 className={styles['Molar-Title']}>モル吸光係数</h5>
                    {excelConcentrationsArray.map((molarity, index) => (
                        <div key={molarity + "-" + index} className={styles['input-group-set']}>
                            <label className={styles['Molar-Label']}><p>{molarity}<br></br> Water </p></label>
                            <input
                                type="text"
                                value={concentrations[molarity] || ''}
                                onChange={e => handleConcentrationChange(e, molarity)}
                            />
                        </div>
                    ))}
                    <div className="Graph-left-side">
                        <button className="unique-button" onClick={onSubmit}>
                            <span className="span-mother">
                                <span>G</span>
                                <span>e</span>
                                <span>n</span>
                                <span>e</span>
                                <span>r</span>
                                <span>a</span>
                                <span>t</span>
                                <span>e</span>
                            </span>
                            <span className="span-mother2">
                                <span>G</span>
                                <span>e</span>
                                <span>n</span>
                                <span>e</span>
                                <span>r</span>
                                <span>a</span>
                                <span>t</span>
                                <span>e</span>
                            </span>
                        </button>
                    </div>
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
        </div>
    );

}

export default ConcentrationGraphComponent;
