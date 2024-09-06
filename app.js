const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 6000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/event_registration', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Event and Registration schemas
const eventSchema = new mongoose.Schema({
    name: String,
    date: String,
    description: String,
});

const registrationSchema = new mongoose.Schema({
    eventId: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
});

const Event = mongoose.model('Event', eventSchema);
const Registration = mongoose.model('Registration', registrationSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Route for the home page
app.get('/', async (req, res) => {
    const events = await Event.find();
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to view event details
app.get('/events', async (req, res) => {
    const events = await Event.find();
    res.json(events);
});

// Route to register for an event
app.post('/register', async (req, res) => {
    const { eventId, name, email } = req.body;
    const registration = new Registration({ eventId, name, email });
    await registration.save();
    res.send('Registration successful!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
