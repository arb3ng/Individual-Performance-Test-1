// app.js

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mongo-test', { useNewUrlParser: true, useUnifiedTopology: true });

// Mongoose schema and model for courses
const courseSchema = new mongoose.Schema({
  code: { type: String, required: true },
  description: { type: String, required: true },
  units: { type: Number, required: true },
  tags: { type: [String], required: true },
});

const Course = mongoose.model('Course', courseSchema);

// Express routes

// Retrieve all published backend courses and sort them alphabetically
app.get('/backend-courses', async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ description: 1 });
    if (!courses) {
      return res.status(404).json({ message: 'No courses found' });
    }
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Select and extract the name and specialization of each course
app.get('/course-details', async (req, res) => {
  try {
    const courseDetails = await Course.find({}, 'description tags');
    if (!courseDetails) {
      return res.status(404).json({ message: 'No course details found' });
    }
    res.json(courseDetails);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Retrieve all published BSIS and BSIT courses from the curriculum
app.get('/bsis-bsit-courses', async (req, res) => {
    try {
      const courses = await Course.find({});
      console.log('courses:', courses);
  
      const bsisCourses = courses.filter(course => course.tags.includes('BSIS'));
      console.log('bsisCourses:', bsisCourses);
  
      const bsitCourses = courses.filter(course => course.tags.includes('BSIT'));
      console.log('bsitCourses:', bsitCourses);
  
      res.json({ bsisCourses, bsitCourses });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
