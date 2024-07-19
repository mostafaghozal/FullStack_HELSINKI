// controllers/blogs.js
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 }); // Populate user info if needed
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error.message);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// POST /api/blogs
blogsRouter.post('/', async (req, res) => {
  const body = req.body;

  if (!body.title || !body.url) {
    return res.status(400).json({ error: 'Title or URL missing' });
  }

  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author || 'Anonymous',
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  });

  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
});

// DELETE /api/blogs/:id
blogsRouter.delete('/:id', async (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Token missing or invalid' });

  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });

  if (blog.user.toString() !== user._id.toString()) {
    return res.status(403).json({ error: 'Permission denied' });
  }

  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

// PUT /api/blogs/:id
blogsRouter.put('/:id', async (req, res) => {
  const { likes } = req.body;
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, { likes }, { new: true });
  if (updatedBlog) {
    res.json(updatedBlog);
  } else {
    res.status(404).json({ error: 'Blog not found' });
  }
});

module.exports = blogsRouter;
