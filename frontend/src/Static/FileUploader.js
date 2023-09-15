import React, { useContext } from 'react';
import * as XLSX from 'xlsx';
import { useExcelData } from './ExcelDataContext';
import styles from './css/FileUploader.module.css'; // Assume you have a context to store the Excel data

const FileUploader = () => {
    const { setExcelData, setExcelFile, setExcelConcentrations } = useExcelData();

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        setExcelFile(file);

        const newConcentrations = {/* ... */};
        setExcelConcentrations(newConcentrations);
    
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
            const firstRow = jsonData[0];
            const concentrations = Object.keys(firstRow).filter(key => key !== '波長');

    
            setExcelData(jsonData);
            setExcelConcentrations(concentrations);
        };
    
        reader.readAsArrayBuffer(file);
    };

    return (
        <div>
            <label htmlFor="fileInput" className={styles['cssbuttons-io-button']}>  {/* Apply styles */}
                ファイルを選択
                <div className={styles.icon}>  {/* Apply styles */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path>
                    </svg>
                </div>
            </label>
            <input id="fileInput" type="file" accept=".xlsx, .xls, .xlsm" onChange={handleFileUpload} style={{display: 'none'}} />
        </div>
    );
};

export default FileUploader;


