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
      if (!formData.name || !formData.email || !formData.password) {
        setError('Все поля обязательны для заполнения');
        return;
      }
    } else {
      if (!formData.email || !formData.password) {
        setError('Email и пароль обязательны');
        return;
      }
    }
    
    onLogin(formData);
    setError('');
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
              required 
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
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Пароль:</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleInputChange} 
            required 
            minLength="6"
          />
        </div>
        
        <button type="submit">{isRegister ? 'Зарегистрироваться' : 'Войти'}</button>
      </form>
      
      <p>
        {isRegister ? 'Уже есть аккаунт?' : 'Ещё не зарегистрированы?'}{' '}
        <button type="button" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </p>
    </div>
  );
}

export default Login;