import { createContext, useContext, useState } from "react";
import axios from "axios";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (url, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios(url, options);
      return response.data;
    } catch (err) {
      setError(err);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ApiContext.Provider value={{ fetchData, loading, error, searchQuery, setSearchQuery }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
