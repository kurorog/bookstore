import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import BookCatalog from './components/BookCatalog';
import Cart from './components/Cart';
import Reviews from './components/Reviews';
import Search from './components/Search';
import Profile from './components/Profile';
import Login from './components/Login';

function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/books')
      .then(response => response.json())
      .then(data => setBooks(data))
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  const addToCart = async (book) => {
    if (!isLoggedIn) {
      alert('Пожалуйста, войдите в систему, чтобы добавить товары в корзину');
      setActiveTab('profile');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          bookId: book.id
        })
      });
      if (response.ok) {
        updateCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (bookId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/cart/${bookId}?userId=${user.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        updateCart();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateCart = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/cart?userId=${user.id}`);
      if (response.ok) {
        const cartItems = await response.json();
        setCart(cartItems);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const handleLogin = async (userData) => {
    try {
      const endpoint = userData.name ? 'http://localhost:3001/api/register' : 'http://localhost:3001/api/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      if (response.ok) {
        const user = await response.json();
        setUser(user);
        setIsLoggedIn(true);
        updateCart();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login error. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCart([]);
  };

  return (
    <div className="app">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
      />
      
      <div className="content">
        {activeTab === 'catalog' && <BookCatalog books={books} addToCart={addToCart} />}
        {activeTab === 'cart' && <Cart cart={cart} removeFromCart={removeFromCart} />}
        {activeTab === 'reviews' && <Reviews user={user} isLoggedIn={isLoggedIn} />}
        {activeTab === 'search' && <Search books={books} />}
        {activeTab === 'profile' && isLoggedIn && <Profile user={user} setUser={setUser} />}
        {activeTab === 'profile' && !isLoggedIn && <Login onLogin={handleLogin} />}
      </div>
    </div>
  );
}

export default App;