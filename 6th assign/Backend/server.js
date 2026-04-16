const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
      console.log('Successfully connected to MongoDB.');
      await seedDatabase();
  })
  .catch((err) => console.log('MongoDB connection error. Is MongoDB running locally?', err.message));

// Define the Trip Schema & Model
const tripSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    destinations: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String, required: true }
});
const Trip = mongoose.model('Trip', tripSchema);

// Define the Booking Schema & Model
const bookingSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    collegeId: { type: String, required: true },
    tripId: { type: String, required: true },
    tripName: { type: String, required: true },
    email: { type: String, required: true },
    dateOfBooking: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', bookingSchema);

// Middleware Setup
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sample Trips Data to initialize the database
const sampleTrips = [
    {
        id: 'trip_01',
        name: 'The Goa Getaway',
        destinations: 'North & South Goa',
        duration: '5 Days / 4 Nights',
        price: '₹8,500',
        imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1974&auto=format&fit=crop',
        description: 'Experience the ultimate college trip filled with beaches, vibrant nightlife, and historic churches.'
    },
    {
        id: 'trip_02',
        name: 'Himalayan Expedition',
        destinations: 'Manali & Kasol',
        duration: '6 Days / 5 Nights',
        price: '₹12,000',
        imageUrl: 'https://images.unsplash.com/photo-1605649487212-4d43b23141fa?q=80&w=2070&auto=format&fit=crop',
        description: 'Trek through the snow-capped mountains, camp under the stars, and explore the valleys of Himachal.'
    },
    {
        id: 'trip_03',
        name: 'Rajasthan Royal Escapade',
        destinations: 'Jaipur, Jodhpur, Jaisalmer',
        duration: '7 Days / 6 Nights',
        price: '₹15,000',
        imageUrl: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070&auto=format&fit=crop',
        description: 'Dive into the rich culture, grand forts, and beautiful desert landscapes of Rajasthan.'
    }
];

async function seedDatabase() {
    try {
        const count = await Trip.countDocuments();
        if (count === 0) {
            await Trip.insertMany(sampleTrips);
            console.log('Sample trips have been initialized to MongoDB.');
        }
    } catch (err) {
        console.log('Error initializing trips:', err.message);
    }
}

// REST APIs

app.get('/api/trips', async (req, res) => {
    try {
        const trips = await Trip.find({});
        res.json(trips);
    } catch (err) {
        res.status(500).json({ error: "Error fetching trips" });
    }
});

app.get('/api/trips/:tripId', async (req, res) => {
    try {
        const trip = await Trip.findOne({ id: req.params.tripId });
        if (!trip) return res.status(404).json({ error: 'Trip not found' });
        res.json(trip);
    } catch (err) {
        res.status(500).json({ error: "Error fetching trip details" });
    }
});

app.post('/api/book', async (req, res) => {
    try {
        const { studentName, collegeId, tripId, tripName, email } = req.body;
        
        const newBooking = new Booking({
            studentName,
            collegeId,
            tripId,
            tripName,
            email
        });
        
        await newBooking.save();
        res.status(201).json({ message: 'Booking successful', booking: newBooking });
    } catch (err) {
        console.error("Booking Error:", err);
        res.status(500).json({ error: "An error occurred while creating your booking." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Travel Agency API Backend is running on http://localhost:${PORT}`);
});
