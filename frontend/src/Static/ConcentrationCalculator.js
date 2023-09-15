import React, { useState, useEffect } from 'react';
import { useExcelData } from './ExcelDataContext';
import './css/ConcentrationCalculator.css';

function ConcentrationCalculator({ onClose, updateConcentrations, setGraphConcentrations: setParentGraphConcentrations }) {
    const { excelConcentrations, setExcelConcentrations } = useExcelData([]);
    const [graphConcentrations, setGraphConcentrations] = useState([]);
    const WATER_MOLECULAR_WEIGHT = 18.01528; // g/mol

    const excelConcentrationsArray = Array.isArray(excelConcentrations)
        ? excelConcentrations
        : [];

    const initialWeights = excelConcentrationsArray.reduce((acc, cur) => {
        acc[cur] = { solutionAndContainer: 0, LiCl: 0, container: 0 };
        return acc;
    }, {});

    const [weights, setWeights] = useState(initialWeights);
    const [concentrations, setConcentrations] = useState({});

    const calculateConcentration = () => {
        let calculatedConcentrations = {};
        if (Array.isArray(excelConcentrations)) {
            for (const molarity of excelConcentrations) {
                const currentWeight = weights[molarity];
                if (!currentWeight) {
                    console.warn(`No weight information for molarity: ${molarity}`);
                    continue;
                }
                const waterWeight = currentWeight.solutionAndContainer - (currentWeight.LiCl + currentWeight.container);
                const waterMolesPerL = waterWeight / WATER_MOLECULAR_WEIGHT * 1000;
                calculatedConcentrations[molarity] = waterMolesPerL.toFixed(4);
            }
        }
        return calculatedConcentrations;
    };

// ...
const applyToGraph = () => {
    const concentrationValues = Object.values(concentrations);
    if (concentrationValues.length > 0) {
        console.log("Concentrations to be set:", concentrationValues);  // <-- For Debugging
        setParentGraphConcentrations(concentrationValues); 
        onClose();  
    } else {
        console.error("No concentrations to apply.");
    }
};


    

    useEffect(() => {
        const newConcentrations = calculateConcentration();
        setConcentrations(newConcentrations);
    }, [weights, excelConcentrations]);

    const updateWeight = (molarity, type, value) => {
        setWeights(prevState => ({
            ...prevState,
            [molarity]: {
                ...prevState[molarity],
                [type]: Number(value)
            }
        }));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="calculator-modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>✖</button>
                <div className="calculator-container">
                    {Array.isArray(excelConcentrations) ? excelConcentrations.map(molarity => (
                        <div key={molarity} className="input-group-set">
                            <h4 className="molarity-header">{molarity}</h4>
                            <div className="input-group">
                                <label>全体の重量</label>
                                <input 
                                    type="number" 
                                    value={weights[molarity]?.solutionAndContainer || ""} 
                                    onChange={e => updateWeight(molarity, 'solutionAndContainer', e.target.value)}
                                    onWheel={(e) => e.target.blur()}
                                    className="Calculator-Input"
                                />
                            </div>
                            <div className="input-group">
                                <label>LiClの重さ</label>
                                <input 
                                    type="number" 
                                    value={weights[molarity]?.LiCl || ""} 
                                    onChange={e => updateWeight(molarity, 'LiCl', e.target.value)}
                                    onWheel={(e) => e.target.blur()}  
                                />
                            </div>
                            <div className="input-group">
                                <label>容器の重さ</label>
                                <input 
                                    type="number" 
                                    value={weights[molarity]?.container || ""} 
                                    onChange={e => updateWeight(molarity, 'container', e.target.value)}
                                    onWheel={(e) => e.target.blur()}  
                                />
                            </div>
                            <div className="concentration-results">
                                <h4>計算結果:</h4>
                                <p>{`${molarity}: ${concentrations[molarity] || '0.0000'}`}</p>
                            </div>
                            
                        </div>
                    )) : <p>Loading...</p>}
                        <button className="calculator-unique-button" onClick={applyToGraph}>
                            <span className="calculator-span-mother">
                                <span>U</span>
                                <span>p</span>
                                <span>t</span>
                                <span>o</span>
                                <span>D</span>
                                <span>a</span>
                                <span>t</span>
                                <span>a</span>
                            </span>
                        </button>
                </div>
            </div>
        </div>
    );
}

export default ConcentrationCalculator;
