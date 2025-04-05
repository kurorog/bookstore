import React, { useState } from 'react';

function Profile({ user, setUser }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(user);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user.id
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setEditMode(false);
        setError('');
      }
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('userId', user.id);

      try {
        const response = await fetch('/api/avatar', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const { avatarUrl } = await response.json();
          setUser({ ...user, avatar_url: avatarUrl });
        }
      } catch (error) {
        console.error('Avatar upload error:', error);
      }
    }
  };

  return (
    <div className="profile">
      <h2>Личный кабинет</h2>
      
      {error && <div className="error">{error}</div>}
      
      {editMode ? (
        <form onSubmit={handleSubmit} className="profile-form">
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
            <label>Страна:</label>
            <input 
              type="text" 
              name="country" 
              value={formData.country} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-group">
            <label>Город:</label>
            <input 
              type="text" 
              name="city" 
              value={formData.city} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-group">
            <label>Возраст:</label>
            <input 
              type="number" 
              name="age" 
              value={formData.age} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-group">
            <label>Новый пароль:</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password || ''} 
              onChange={handleInputChange} 
              placeholder="Оставьте пустым, чтобы не менять"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit">Сохранить</button>
            <button type="button" onClick={() => setEditMode(false)}>Отмена</button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          <div className="avatar">
            <img src={user.avatar_url || 'https://via.placeholder.com/150'} alt="Avatar" />
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleAvatarUpload} 
              style={{ display: 'none' }} 
              id="avatar-upload"
            />
            <label htmlFor="avatar-upload" className="avatar-upload-label">
              Изменить аватар
            </label>
          </div>
          
          <div className="info">
            <p><strong>Имя:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Страна:</strong> {user.country || 'Не указано'}</p>
            <p><strong>Город:</strong> {user.city || 'Не указано'}</p>
            <p><strong>Возраст:</strong> {user.age || 'Не указано'}</p>
          </div>
          
          <button onClick={() => setEditMode(true)}>Редактировать профиль</button>
        </div>
      )}
    </div>
  );
}

export default Profile;
