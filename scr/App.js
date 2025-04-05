import React, { useState } from 'react';
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

  const addToCart = (book) => {
    setCart([...cart, book]);
  };

  const removeFromCart = (bookId) => {
    setCart(cart.filter(book => book.id !== bookId));
  };

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <div className="app">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartCount={cart.length}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
      />
      
      <div className="content">
        {activeTab === 'catalog' && <BookCatalog addToCart={addToCart} />}
        {activeTab === 'cart' && <Cart cart={cart} removeFromCart={removeFromCart} />}
        {activeTab === 'reviews' && <Reviews />}
        {activeTab === 'search' && <Search />}
        {activeTab === 'profile' && isLoggedIn && <Profile user={user} setUser={setUser} />}
        {activeTab === 'profile' && !isLoggedIn && <Login onLogin={handleLogin} />}
      </div>
    </div>
  );
}

export default App;