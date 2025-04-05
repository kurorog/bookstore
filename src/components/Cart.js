import React from 'react';

function Cart({ cart, removeFromCart }) {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: cart[0].user_id
        })
      });

      if (response.ok) {
        alert('Order placed successfully!');
        removeFromCart('all'); // Clear cart
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  return (
    <div className="cart">
      <h2>Корзина покупок</h2>
      
      {cart.length === 0 ? (
        <p>Ваша корзина пуста</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <h3>{item.title}</h3>
                <p>Author: {item.author}</p>
                <p>Price: {item.price} × {item.quantity} = {item.price * item.quantity}</p>
                <button onClick={() => removeFromCart(item.id)}>Удалить</button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Итого: {total} руб.</h3>
            <button onClick={handleCheckout}>Оформить заказ</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
