// index.js
require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');
const Blog = require('./models/blog'); // Make sure to import your Blog model
const usersRouter = require('./routes/users');
const userExtractor = require('./middleware/userExtractor');

app.use('/api/users', usersRouter);
const tokenExtractor = require('./middleware/tokenExtractor');

const mongoUrl = 'mongodb+srv://ghozal:ghozal@cluster0.7oykssj.mongodb.net/bloglist?retryWrites=true&w=majority';
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors());
app.use(express.json());
app.use('/api/blogs',tokenExtractor, userExtractor, blogsRouter);

// DELETE a blog post by ID
app.delete('/api/blogs/:id', async (request, response) => {
  const id = request.params.id;
  const token = request.token;
  if (!token) return res.status(401).json({ error: 'Token missing or invalid' });
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) return res.status(401).json({ error: 'Token invalid' });

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (deletedBlog) {
      response.status(204).end(); // Successfully deleted, no content to send back
    } else {
      response.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    console.error('Error deleting blog:', error.message);
    response.status(500).json({ error: 'Failed to delete blog' });
  }
});

// PUT to update a blog post by ID
app.put('/api/blogs/:id', async (request, response) => {
  const id = request.params.id;
  const { likes } = request.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, { likes }, { new: true });
    if (updatedBlog) {
      response.json(updatedBlog);
    } else {
      response.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    console.error('Error updating blog:', error.message);
    response.status(500).json({ error: 'Failed to update blog' });
  }
});

// Handle unknown routes
app.use((request, response) => {
  response.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Export app for testing
