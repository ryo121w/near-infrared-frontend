import React from 'react';
import { useEffect, useState } from "react";
import axios from 'axios';
import { useExcelData } from './ExcelDataContext'; // ExcelDataContextからデータを取得するためのカスタムフック
import styles from './css/GraphComponent.module.css';
import './css/Button.css';

const BASE_API_URL = process.env.REACT_APP_API_ENDPOINT;

function GraphComponent() {
  const [graphUrl, setGraphUrl] = useState(null);
  const [showGraph, setShowGraph] = useState(false); // 追加
  const { excelData, excelFile } = useExcelData(); // ContextからExcelデータとExcelファイルを取得
  const [showCalculator, setShowCalculator] = useState(false); // New state
  const [showSecondCalculator, setShowSecondCalculator] = useState(false); // New state


  useEffect(() => {
    console.log("Excel data:", excelData);
    console.log("Excel file:", excelFile);
  }, [excelData, excelFile]);


  useEffect(() => {
    if (showGraph) {
      setTimeout(() => {
        setShowCalculator(true);
      }, 600); // 500ms delay

      setTimeout(() => {
        setShowSecondCalculator(true);
      }, 1000); // 1000ms delay
    }
  }, [showGraph]);

  const fetchGraph = async () => {
    console.log("fetchGraph called");
    if (!excelData || !excelFile) {
      console.log("Excel data or file is missing");
      return;
    }

    const formData = new FormData();
    formData.append('file', excelFile);
    formData.append('concentrations', JSON.stringify(excelData));

    try {
      const response = await axios.post(`${BASE_API_URL}api/upload/`, formData);
      if (response.data && response.data.graph_url) {
        setGraphUrl(response.data.graph_url);
        setShowGraph(true); // アニメーションを開始
      }
    } catch (error) {
      console.error("Error generating the graph:", error);
    }
  };


  return (
    <div className={styles['Graph-container']}>
      <div className={styles['Graph-left-side']}>
        <h4 className={styles['NIR-title']}>NIRスペクトル</h4>
        <button className='unique-button' onClick={fetchGraph}> {/* Button の CSS Module を適用 */}
          <span className='span-mother'>
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
      <div className={styles['Graph-right-side']}>
        <div className={`${styles['Bento_NIRGraph']} ${showGraph ? styles['show-element'] : ''}`}>
          {graphUrl && <img className={styles['NIRGraph']} src={`http://localhost:8000${graphUrl}`} alt="NIR Spectrum" />}
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
}

export default GraphComponent;


