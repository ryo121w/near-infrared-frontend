import { createContext, useContext, useState, useEffect } from 'react';

const ExcelDataContext = createContext();

export const useExcelData = () => useContext(ExcelDataContext);

export const ExcelDataProvider = ({ children }) => {
    const [excelData, setExcelData] = useState(null);
    const [excelFile, setExcelFile] = useState(null);
    const [excelConcentrations, setExcelConcentrations] = useState([]);
    const [concentrations, setConcentrations] = useState({});

    useEffect(() => {
        if (!Array.isArray(excelConcentrations)) {
            console.error("excelConcentrations should be an array but got:", excelConcentrations);
        }
        console.log('Current value of excelConcentrations:', excelConcentrations);
    }, [excelConcentrations]);





    useEffect(() => {
        console.log("Updated concentrations in provider:", concentrations);
    }, [concentrations]);

    return (
        <ExcelDataContext.Provider value={{ excelData, setExcelData, excelFile, setExcelFile, excelConcentrations, setExcelConcentrations, concentrations, setConcentrations }}>
        {children}
        </ExcelDataContext.Provider>
    );

    };