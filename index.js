//Requires the following packages, models, etc.
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

//Connects to the yelp-camp database
mongoose.connect('mongodb://localhost:27017/yelp-camp');

//Confirms the database is connected and returns an error message if not
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('DATABASE CONNECTED');
});

//Executes express
const app = express();

//Sets the view engine to EJS and sets the views path to our views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Uses express's urlencoded middleware and the external method-override package
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//Home route
app.get('/', (req, res) => {
    res.render('home');
})

//Main campgrounds page route
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

//Renders new campground page
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

//Post route for adding new campgrounds and redirects to the newly created
//campground's details page
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})

//Renders a specific campgrounds' details page
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
})

//Renders an edit page for a specific campground where details can be altered
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
})

//Applies edits made to a specific campground
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, { new: true });
    res.redirect(`/campgrounds/${campground._id}`);
})

//Deletes a specific campground from the all campgrounds page and its details page
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id); 
    res.redirect('/campgrounds');
})

//Listener for localhost:3000
app.listen(3000, () => {
    console.log('SERVING ON PORT 3000');
})