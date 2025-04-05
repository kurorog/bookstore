import React, { useState, useEffect } from 'react';

function Reviews({ user, isLoggedIn }) {
  const [reviews, setReviews] = useState([]);
  const [books, setBooks] = useState([]);
  const [newReview, setNewReview] = useState({ bookId: '', rating: 5, text: '' });
  const [filterRating, setFilterRating] = useState(0);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    // Load reviews from API
    fetch('/api/reviews')
      .then(response => response.json())
      .then(data => setReviews(data))
      .catch(error => console.error('Error fetching reviews:', error));

    // Load books from API
    fetch('/api/books')
      .then(response => response.json())
      .then(data => setBooks(data))
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview({
      ...newReview,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      setNotification('Пожалуйста, войдите в систему, чтобы оставить отзыв');
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newReview,
          userId: user.id
        })
      });

      if (response.ok) {
        const addedReview = await response.json();
        setReviews([...reviews, addedReview]);
        setNewReview({ bookId: '', rating: 5, text: '' });
        setNotification('Ваш отзыв успешно добавлен!');
        setTimeout(() => setNotification(''), 3000);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      try {
        const response = await fetch(`/api/reviews/${reviewId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id })
        });

        if (response.ok) {
          setReviews(reviews.filter(review => review.id !== reviewId));
        }
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const filteredReviews = filterRating > 0 
    ? reviews.filter(review => review.rating === Number(filterRating))
    : reviews;

  return (
    <div className="reviews">
      <h2>Отзывы пользователей</h2>
      
      <div className="review-filters">
        <label>Фильтр по рейтингу:</label>
        <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
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
            <h3>{books.find(b => b.id === review.book_id)?.title || `Книга #${review.book_id}`}</h3>
            <p>Пользователь: {review.userName}</p>
            <p>Рейтинг: {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
            <p>{review.text}</p>
            <small>{new Date(review.created_at).toLocaleDateString()}</small>
            {isLoggedIn && user.id === review.user_id && (
              <button onClick={() => handleDeleteReview(review.id)}>Удалить отзыв</button>
            )}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="add-review">
      <h3>Добавить отзыв</h3>
        
        <div className="form-group">
            <label>Книга:</label>
            <select 
              name="bookId" 
              value={newReview.bookId} 
              onChange={handleInputChange} 
              required
            >
              <option value="">Выберите книгу</option>
            {books.map(book => (
              <option key={book.id} value={book.id}>{book.title}</option>
            ))}
          </select>
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
