import React, { useState } from 'react';
import Book from './Book';

const booksData = [
  { id: 1, title: '1984', author: 'Джордж Оруэлл', genre: 'Антиутопия', price: 350, rating: 4.5 },
  { id: 2, title: 'Мастер и Маргарита', author: 'Михаил Булгаков', genre: 'Роман', price: 420, rating: 5 },
  { id: 3, title: 'Преступление и наказание', author: 'Фёдор Достоевский', genre: 'Роман', price: 380, rating: 4.7 },
  { id: 4, title: 'Гарри Поттер и философский камень', author: 'Дж. К. Роулинг', genre: 'Фэнтези', price: 500, rating: 4.8 },
  { id: 5, title: 'Война и мир', author: 'Лев Толстой', genre: 'Роман', price: 450, rating: 4.6 },
];

function BookCatalog({ addToCart }) {
  const [books, setBooks] = useState(booksData);
  const [filters, setFilters] = useState({
    genre: '',
    minPrice: '',
    maxPrice: '',
  });
  const [sortBy, setSortBy] = useState('');

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const applyFilters = () => {
    let filteredBooks = [...booksData];
    
    if (filters.genre) {
      filteredBooks = filteredBooks.filter(book => book.genre === filters.genre);
    }
    
    if (filters.minPrice) {
      filteredBooks = filteredBooks.filter(book => book.price >= Number(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      filteredBooks = filteredBooks.filter(book => book.price <= Number(filters.maxPrice));
    }
    
    setBooks(filteredBooks);
  };

  const handleSort = (type) => {
    setSortBy(type);
    let sortedBooks = [...books];
    
    if (type === 'price-asc') {
      sortedBooks.sort((a, b) => a.price - b.price);
    } else if (type === 'price-desc') {
      sortedBooks.sort((a, b) => b.price - a.price);
    } else if (type === 'rating') {
      sortedBooks.sort((a, b) => b.rating - a.rating);
    } else if (type === 'title') {
      sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setBooks(sortedBooks);
  };

  const genres = [...new Set(booksData.map(book => book.genre))];

  return (
    <div className="book-catalog">
      <h2>Каталог книг</h2>
      
      <div className="filters">
        <div className="filter-group">
          <label>Жанр:</label>
          <select name="genre" value={filters.genre} onChange={handleFilterChange}>
            <option value="">Все</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Цена от:</label>
          <input 
            type="number" 
            name="minPrice" 
            value={filters.minPrice} 
            onChange={handleFilterChange} 
            placeholder="Мин. цена"
          />
        </div>
        
        <div className="filter-group">
          <label>до:</label>
          <input 
            type="number" 
            name="maxPrice" 
            value={filters.maxPrice} 
            onChange={handleFilterChange} 
            placeholder="Макс. цена"
          />
        </div>
        
        <button onClick={applyFilters}>Применить фильтры</button>
      </div>
      
      <div className="sort-options">
        <span>Сортировать по:</span>
        <button onClick={() => handleSort('price-asc')}>Цене (по возрастанию)</button>
        <button onClick={() => handleSort('price-desc')}>Цене (по убыванию)</button>
        <button onClick={() => handleSort('rating')}>Рейтингу</button>
        <button onClick={() => handleSort('title')}>Названию</button>
      </div>
      
      <div className="books-list">
        {books.map(book => (
          <Book key={book.id} book={book} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
}

export default BookCatalog;