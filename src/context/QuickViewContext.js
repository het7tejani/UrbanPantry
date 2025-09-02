import React, { useState, createContext, useContext } from 'react';

const QuickViewContext = createContext();

export const QuickViewProvider = ({ children }) => {
    const [quickViewProductId, setQuickViewProductId] = useState(null);
    
    const value = { quickViewProductId, setQuickViewProductId };
    
    return <QuickViewContext.Provider value={value}>{children}</QuickViewContext.Provider>;
};

export const useQuickView = () => useContext(QuickViewContext);