import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Send, Star } from 'lucide-react';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    courseName: '',
    studentName: '',
    rating: 5,
    comments: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRatingHover = (val) => {
    // optional interactive stars can be added
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('http://127.0.0.1:5001/api/feedback', formData);
      navigate('/');
    } catch (error) {
      console.error('Error submitting feedback', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="glass glass-card">
        <h2 style={{ marginBottom: '8px', fontSize: '1.5rem' }}>Share Your Experience</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Help us improve by providing honest feedback about your course.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Student Name</label>
            <input
              required
              type="text"
              className="form-input"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Course Name</label>
            <input
              required
              type="text"
              className="form-input"
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Rating (1-5)</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: formData.rating >= star ? '#fbbf24' : 'rgba(255,255,255,0.2)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Star size={32} fill={formData.rating >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
              <span style={{ marginLeft: '12px', fontSize: '1.2rem', fontWeight: 'bold' }}>{formData.rating}/5</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Comments</label>
            <textarea
              required
              className="form-textarea"
              rows="5"
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1.1rem' }}
          >
            {isSubmitting ? 'Submitting...' : <><Send size={20} /> Submit Review</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
