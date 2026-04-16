import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, MessageSquare } from 'lucide-react';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5001/api/feedback');
        setFeedbacks(response.data);
      } catch (error) {
        console.error('Failed to fetch feedbacks', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
        <p>Loading feedback...</p>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="glass glass-card fade-in" style={{ textAlign: 'center', margin: '40px auto', maxWidth: '600px' }}>
        <MessageSquare size={48} color="var(--primary)" style={{ opacity: 0.8, marginBottom: '16px' }} />
        <h2>No Feedback Yet</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem' }}>Recent Reviews</h2>
        <p style={{ color: 'var(--text-muted)' }}>See what students are saying about their courses.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {feedbacks.map((item) => (
          <div key={item._id} className="glass glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--primary)' }}>{item.courseName}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>by {item.studentName}</p>
              </div>
              <div style={{ display: 'flex', gap: '2px', background: 'rgba(16, 185, 129, 0.1)', padding: '6px 12px', borderRadius: '20px', color: 'var(--success)', fontWeight: 'bold' }}>
                <Star size={16} fill="currentColor" /> {item.rating}
              </div>
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', flexGrow: 1 }}>
              <p style={{ fontStyle: 'italic', lineHeight: 1.5 }}>"{item.comments}"</p>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;
