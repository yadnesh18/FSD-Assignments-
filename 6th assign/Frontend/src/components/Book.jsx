import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Book() {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [formData, setFormData] = useState({
        studentName: '',
        collegeId: '',
        email: ''
    });

    useEffect(() => {
        axios.get(`http://localhost:5001/api/trips/${tripId}`)
            .then(res => setTrip(res.data))
            .catch(err => console.error("Error fetching trip details:", err));
    }, [tripId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                tripId: trip.id,
                tripName: trip.name
            };
            const response = await axios.post('http://localhost:5001/api/book', payload);
            navigate('/success', { state: { booking: response.data.booking } });
        } catch (error) {
            console.error("Booking error:", error);
            alert("Failed to submit booking. Please try again.");
        }
    };

    if (!trip) return <div style={{textAlign: 'center', padding: '4rem'}}>Loading trip details...</div>;

    return (
        <div className="booking-section">
            <div className="booking-header">
                <h2>Book Your Spot!</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    You are booking the <strong>{trip.name}</strong> package for <strong>{trip.price}</strong>.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="studentName">Student Full Name</label>
                    <input type="text" id="studentName" name="studentName" required placeholder="e.g. John Doe" value={formData.studentName} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="collegeId">College University Roll/ID Number</label>
                    <input type="text" id="collegeId" name="collegeId" required placeholder="e.g. CS2024-001" value={formData.collegeId} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Student Email Address</label>
                    <input type="email" id="email" name="email" required placeholder="john.doe@college.edu" value={formData.email} onChange={handleChange} />
                </div>

                <button type="submit" className="btn">Confirm Booking Inquiry</button>
            </form>
        </div>
    );
}

export default Book;
