import React from 'react';

function Cart({ cart, removeFromCart }) {
  const total = cart.reduce((sum, book) => sum + book.price, 0);

  return (
    <div className="cart">
      <h2>Корзина покупок</h2>
      
      {cart.length === 0 ? (
        <p>Ваша корзина пуста</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((book, index) => (
              <div key={`${book.id}-${index}`} className="cart-item">
                <h3>{book.title}</h3>
                <p>Автор: {book.author}</p>
                <p>Цена: {book.price} руб.</p>
                <button onClick={() => removeFromCart(book.id)}>Удалить</button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Итого: {total} руб.</h3>
            <button>Оформить заказ</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;