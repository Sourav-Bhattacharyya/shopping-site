// SearchResults.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Product from './Product';
import '../styles/SearchResults.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    price: ''
  });
  const query = useQuery().get('query');

  useEffect(() => {
    fetchResults();
  }, [query, filters]);

  const fetchResults = () => {
    // Add your API endpoint here
    axios.post(`${process.env.REACT_APP_API_BASE_URL}/product/search/`, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      params: {
        query: query,
        ...filters
      }
    })
      .then(response => {
        setResults(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching search results:', error);
        setError('Error fetching search results');
        setLoading(false);
      });
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setShowFilters(false);
    fetchResults();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (results.length === 0) {
    return <div>No results found</div>;
  }

  return (
    <div className="search-results-container">
      <button className="filter-button" onClick={() => setShowFilters(!showFilters)}>
        Filter Results
      </button>
      {showFilters && (
        <div className="filters">
          <form onSubmit={handleFilterSubmit}>
            <div className="filter-option">
              <label>Category:</label>
              <input type="text" name="category" value={filters.category} onChange={handleFilterChange} />
            </div>
            <div className="filter-option">
              <label>Brand:</label>
              <input type="text" name="brand" value={filters.brand} onChange={handleFilterChange} />
            </div>
            <div className="filter-option">
              <label>Price:</label>
              <input type="text" name="price" value={filters.price} onChange={handleFilterChange} />
            </div>
            <button type="submit" className="apply-filters-button">Apply Filters</button>
          </form>
        </div>
      )}
      <div className="search-results">
        {results.map(product => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default SearchResults;
