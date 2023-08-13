const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('DATABASE CONNECTED');
});

const seedDB = async () => {
    await Campground.deleteMany({});
    const c = new Campground({title: 'purple fields'});
    await c.save();
}