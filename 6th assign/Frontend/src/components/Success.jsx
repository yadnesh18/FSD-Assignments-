import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

function Success() {
    const location = useLocation();
    const booking = location.state?.booking;

    if (!booking) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="success-container">
            <div className="success-icon">✓</div>
            <h2>Booking Inquiry Received!</h2>
            <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem 0', fontSize: '1.1rem' }}>
                Thank you, <strong>{booking.studentName}</strong>! Your interest for the <strong>{booking.tripName}</strong> has been securely logged. <br /><br />
                A confirmation along with payment details will be sent to <strong>{booking.email}</strong>.
            </p>
            <Link to="/" className="btn" style={{ width: 'auto', padding: '0.75rem 2rem' }}>Return to Homepage</Link>
        </div>
    );
}

export default Success;
