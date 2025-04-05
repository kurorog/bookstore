import React from 'react';

function Book({ book, addToCart }) {
  return (
    <div className="book">
      <h3>{book.title}</h3>
      <p>Автор: {book.author}</p>
      <p>Жанр: {book.genre}</p>
      <p>Цена: {book.price} руб.</p>
      <p>Рейтинг: {'★'.repeat(Math.round(book.rating))}{'☆'.repeat(5 - Math.round(book.rating))}</p>
      <button onClick={() => addToCart(book)}>Добавить в корзину</button>
    </div>
  );
}

export default Book;