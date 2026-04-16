import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5001/api/trips')
            .then(res => {
                setTrips(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching trips:", err);
                setLoading(false);
            });
    }, []);

    return (
        <main>
            <section className="hero">
                <h2>Unforgettable College Trips</h2>
                <p>Book your perfect getaway with friends. From serene beaches to majestic mountains, we have the best packages curated exclusively for college students.</p>
                <a href="#trips" className="btn" style={{ width: 'auto', padding: '1rem 2rem' }}>Explore Destinations</a>
            </section>

            <section id="trips" className="trips-container">
                {loading ? (
                    <p style={{textAlign: "center", gridColumn: "1 / -1"}}>Loading exciting packages...</p>
                ) : (
                    trips.map(trip => (
                        <div key={trip.id} className="trip-card">
                            <img src={trip.imageUrl} alt={trip.name} className="trip-image" />
                            <div className="trip-content">
                                <h3 className="trip-title">{trip.name}</h3>
                                <div className="trip-info">
                                    <span>📍 {trip.destinations}</span>
                                    <span>⏱ {trip.duration}</span>
                                </div>
                                <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                    {trip.description}
                                </p>
                                <div className="trip-info" style={{ alignItems: 'flex-end', marginBottom: 0 }}>
                                    <span className="trip-price">{trip.price}</span>
                                </div>
                                <div style={{ marginTop: '1.5rem' }}>
                                    <Link to={`/book/${trip.id}`} className="btn">Book Now</Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </section>
        </main>
    );
}

export default Home;
