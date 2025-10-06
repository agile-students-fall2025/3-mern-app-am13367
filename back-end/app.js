require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})
// About Us route
app.get('/about', (req, res) => {
  res.json({
    name: 'Ahmed Arkam Mohamed Faisaar',
    about: [
      "Hello! I am currently a Junior at NYU Abu Dhabi, majoring in Computer Science. I have a deep passion for data science, technology, and creative problem-solving. Over the past few years, I have explored various projects that combine coding skills with innovative ideas to solve real-world problems.",
      
      "I enjoy building projects that connect technical thinking with human impact. For example, I have worked on projects that analyze data to reveal meaningful insights, create interactive web applications, and explore machine learning applications in everyday life. My goal is to focus on projects that can make a lasting impact on society.",
      
      "At the moment, I am studying abroad in New York, taking several courses related to computer science, data science, and AI. I am especially fascinated by machine learning, natural language processing, and predictive modeling. I am actively seeking opportunities to enhance my skills and apply them to challenging real-world problems.",
      
      "Outside of academics, I love exploring emerging technologies, experimenting with creative coding projects, and learning from diverse perspectives. I believe in continuous self-improvement, teamwork, and using my skills to contribute positively to the world. I am excited about combining my technical knowledge with creativity to develop solutions that matter."
    ],
    photoUrl:
      '/am.jpg', // replace with your image URL
  })
})


// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
