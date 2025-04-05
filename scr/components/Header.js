import React from 'react';
import { Link } from 'react-router-dom';

function Header({ activeTab, setActiveTab, cartCount, isLoggedIn, user, onLogout }) {
  return (
    <header className="header">
      <div className="logo">Книжный магазин</div>
      <nav className="nav">
        <button 
          className={activeTab === 'catalog' ? 'active' : ''} 
          onClick={() => setActiveTab('catalog')}
        >
          Каталог
        </button>
        <button 
          className={activeTab === 'cart' ? 'active' : ''} 
          onClick={() => setActiveTab('cart')}
        >
          Корзина ({cartCount})
        </button>
        <button 
          className={activeTab === 'reviews' ? 'active' : ''} 
          onClick={() => setActiveTab('reviews')}
        >
          Отзывы
        </button>
        <button 
          className={activeTab === 'search' ? 'active' : ''} 
          onClick={() => setActiveTab('search')}
        >
          Поиск
        </button>
        <button 
          className={activeTab === 'profile' ? 'active' : ''} 
          onClick={() => setActiveTab('profile')}
        >
          {isLoggedIn ? user.name : 'Войти'}
        </button>
        {isLoggedIn && (
          <button onClick={onLogout}>Выйти</button>
        )}
      </nav>
    </header>
  );
}

export default Header;