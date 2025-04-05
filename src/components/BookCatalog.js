import React, { useState, useEffect } from 'react';
import Book from './Book';

function BookCatalog({ books, addToCart }) {
  const [filters, setFilters] = useState({
    genre: '',
    minPrice: '',
    maxPrice: '',
  });
  const [filteredBooks, setFilteredBooks] = useState(books);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    setFilteredBooks(books);
    // Extract unique genres
    setGenres([...new Set(books.map(book => book.genre))]);
  }, [books]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const applyFilters = () => {
    let result = [...books];
    
    if (filters.genre) {
      result = result.filter(book => book.genre === filters.genre);
    }
    
    if (filters.minPrice) {
      result = result.filter(book => book.price >= Number(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      result = result.filter(book => book.price <= Number(filters.maxPrice));
    }
    
    setFilteredBooks(result);
  };

  const handleSort = (type) => {
    let sortedBooks = [...filteredBooks];
    
    switch (type) {
      case 'price-asc':
        sortedBooks.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedBooks.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedBooks.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'title':
        sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    
    setFilteredBooks(sortedBooks);
  };

  return (
    <div className="book-catalog">
      <h2>Book Catalog</h2>
      
      <div className="filters">
        <div className="filter-group">
          <label>Genre:</label>
          <select name="genre" value={filters.genre} onChange={handleFilterChange}>
            <option value="">All</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Price from:</label>
          <input 
            type="number" 
            name="minPrice" 
            value={filters.minPrice} 
            onChange={handleFilterChange} 
            placeholder="Min price"
          />
        </div>
        
        <div className="filter-group">
          <label>to:</label>
          <input 
            type="number" 
            name="maxPrice" 
            value={filters.maxPrice} 
            onChange={handleFilterChange} 
            placeholder="Max price"
          />
        </div>
        
        <button onClick={applyFilters}>Apply Filters</button>
      </div>
      
      <div className="sort-options">
        <span>Sort by:</span>
        <button onClick={() => handleSort('price-asc')}>Price (low to high)</button>
        <button onClick={() => handleSort('price-desc')}>Price (high to low)</button>
        <button onClick={() => handleSort('rating')}>Rating</button>
        <button onClick={() => handleSort('title')}>Title</button>
      </div>
      
      <div className="books-list">
        {filteredBooks.map(book => (
          <Book key={book.id} book={book} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
}

export default BookCatalog;
