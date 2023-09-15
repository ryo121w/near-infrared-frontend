import React, { createContext, useContext, useState } from 'react';

const SavedFilePathContext = createContext();

export const useSavedFilePath = () => {
    const context = useContext(SavedFilePathContext);
    if (!context) {
        throw new Error('useSavedFilePath must be used within a SavedFilePathProvider');
    }
    return context;
};

export const SavedFilePathProvider = ({ children }) => {
    const [savedFilePath, setSavedFilePath] = useState(null);

    return (
        <SavedFilePathContext.Provider value={{ savedFilePath, setSavedFilePath }}>
        {children}
        </SavedFilePathContext.Provider>
    );
};
