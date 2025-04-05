import React, { useState } from 'react';

const initialReviews = [
  { id: 1, bookId: 1, userName: 'Иван', rating: 5, text: 'Отличная книга!', date: '2023-05-10' },
  { id: 2, bookId: 2, userName: 'Мария', rating: 4, text: 'Очень интересно, но длинновато', date: '2023-05-15' },
  { id: 3, bookId: 1, userName: 'Алексей', rating: 3, text: 'Неплохо, но ожидал большего', date: '2023-05-20' },
];

function Reviews() {
  const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState({ bookId: '', rating: 5, text: '' });
  const [filterRating, setFilterRating] = useState(0);
  const [notification, setNotification] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({
      ...newReview,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const review = {
      id: reviews.length + 1,
      bookId: Number(newReview.bookId),
      userName: 'Текущий пользователь',
      rating: Number(newReview.rating),
      text: newReview.text,
      date: new Date().toISOString().split('T')[0]
    };
    
    setReviews([...reviews, review]);
    setNewReview({ bookId: '', rating: 5, text: '' });
    setNotification('Ваш отзыв успешно добавлен!');
    setTimeout(() => setNotification(''), 3000);
  };

  const filteredReviews = filterRating > 0 
    ? reviews.filter(review => review.rating === filterRating)
    : reviews;

  return (
    <div className="reviews">
      <h2>Отзывы пользователей</h2>
      
      <div className="review-filters">
        <label>Фильтр по рейтингу:</label>
        <select value={filterRating} onChange={(e) => setFilterRating(Number(e.target.value))}>
          <option value="0">Все</option>
          <option value="1">★</option>
          <option value="2">★★</option>
          <option value="3">★★★</option>
          <option value="4">★★★★</option>
          <option value="5">★★★★★</option>
        </select>
      </div>
      
      {notification && <div className="notification">{notification}</div>}
      
      <div className="review-list">
        {filteredReviews.map(review => (
          <div key={review.id} className="review">
            <h3>Книга #{review.bookId}</h3>
            <p>Пользователь: {review.userName}</p>
            <p>Рейтинг: {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
            <p>{review.text}</p>
            <small>{review.date}</small>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="add-review">
        <h3>Добавить отзыв</h3>
        
        <div className="form-group">
          <label>ID книги:</label>
          <input 
            type="number" 
            name="bookId" 
            value={newReview.bookId} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Рейтинг:</label>
          <select 
            name="rating" 
            value={newReview.rating} 
            onChange={handleInputChange}
          >
            <option value="1">★</option>
            <option value="2">★★</option>
            <option value="3">★★★</option>
            <option value="4">★★★★</option>
            <option value="5">★★★★★</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Текст отзыва:</label>
          <textarea 
            name="text" 
            value={newReview.text} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        
        <button type="submit">Отправить отзыв</button>
      </form>
    </div>
  );
}

export default Reviews;