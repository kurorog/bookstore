import React, { useState } from 'react';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isRegister) {
      // Регистрация
      if (!formData.name || !formData.email || !formData.password) {
        setError('Все поля обязательны для заполнения');
        return;
      }
      
      onLogin({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        country: '',
        city: '',
        age: ''
      });
    } else {
      // Авторизация
      if (!formData.email || !formData.password) {
        setError('Email и пароль обязательны');
        return;
      }
      
      // В реальном приложении здесь была бы проверка на сервере
      onLogin({
        name: 'Пользователь',
        email: formData.email,
        country: 'Россия',
        city: 'Москва',
        age: '30'
      });
    }
  };

  return (
    <div className="login">
      <h2>{isRegister ? 'Регистрация' : 'Авторизация'}</h2>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div className="form-group">
            <label>Имя:</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleInputChange} 
            />
          </div>
        )}
        
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleInputChange} 
          />
        </div>
        
        <div className="form-group">
          <label>Пароль:</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleInputChange} 
          />
        </div>
        
        <button type="submit">{isRegister ? 'Зарегистрироваться' : 'Войти'}</button>
      </form>
      
      <p>
        {isRegister ? 'Уже есть аккаунт?' : 'Ещё не зарегистрированы?'}{' '}
        <button onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </p>
    </div>
  );
}

export default Login;