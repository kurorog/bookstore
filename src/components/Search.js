import React, { useState } from 'react';
import Book from './Book';

const allBooks = [
  { id: 1, title: '1984', author: 'Джордж Оруэлл', genre: 'Антиутопия', price: 350, rating: 4.5 },
  { id: 2, title: 'Мастер и Маргарита', author: 'Михаил Булгаков', genre: 'Роман', price: 420, rating: 5 },
  { id: 3, title: 'Преступление и наказание', author: 'Фёдор Достоевский', genre: 'Роман', price: 380, rating: 4.7 },
  { id: 4, title: 'Гарри Поттер и философский камень', author: 'Дж. К. Роулинг', genre: 'Фэнтези', price: 500, rating: 4.8 },
  { id: 5, title: 'Война и мир', author: 'Лев Толстой', genre: 'Роман', price: 450, rating: 4.6 },
];

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('title');
  const [results, setResults] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    
    const filteredBooks = allBooks.filter(book => {
      const fieldValue = book[searchBy].toString().toLowerCase();
      return fieldValue.includes(searchTerm.toLowerCase());
    });
    
    setResults(filteredBooks);
  };

  return (
    <div className="search">
      <h2>Поиск по сайту</h2>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-inputs">
          <input 
            type="text" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="Введите поисковый запрос"
          />
          
          <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
            <option value="title">По названию</option>
            <option value="author">По автору</option>
            <option value="genre">По жанру</option>
          </select>
          
          <button type="submit">Найти</button>
        </div>
      </form>
      
      <div className="search-results">
        {results.length > 0 ? (
          <>
            <h3>Результаты поиска ({results.length})</h3>
            <div className="books-list">
              {results.map(book => (
                <Book key={book.id} book={book} />
              ))}
            </div>
          </>
        ) : searchTerm ? (
          <p>Ничего не найдено</p>
        ) : (
          <p>Введите поисковый запрос</p>
        )}
      </div>
    </div>
  );
}

export default Search;