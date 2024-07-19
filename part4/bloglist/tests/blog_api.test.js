// tests/blog_api.test.js
const assert = require('assert').strict;
const supertest = require('supertest');
const app = require('../index'); // Adjust the path if necessary
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Import bcrypt

const api = supertest(app);
let authToken;

describe('Blog API', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    const testUser = new User({
      username: 'testuser',
      passwordHash: await bcrypt.hash('password', 10), // Properly hash the password
      name: 'Test User'
    });
    await testUser.save();

    const userForToken = {
      username: testUser.username,
      id: testUser._id
    };

    authToken = jwt.sign(userForToken, process.env.SECRET); // Ensure SECRET is defined
  });

  describe('GET /api/blogs', () => {
    it('returns correct amount of blogs in JSON', async () => {
      const response = await api.get('/api/blogs').set('Authorization', `Bearer ${authToken}`);
      // Include the token in the request header

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.type, 'application/json');
      assert.deepStrictEqual(response.body, []); // Assuming it returns an empty array initially
    });
  });

  describe('POST /api/blogs', () => {
    it('succeeds with valid data and token', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'John Doe',
        url: 'https://example.com',
        likes: 10
      };

      const response = await api.post('/api/blogs')
        .set('Authorization', `Bearer ${authToken}`) // Include the token in the request header
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(response.body.title, newBlog.title);
    });

    it('fails with status code 401 if token is missing', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'John Doe',
        url: 'https://example.com',
        likes: 10
      };

      await api.post('/api/blogs')
        .send(newBlog)
        .expect(401); // Expect 401 Unauthorized
    });

    it('fails with status code 401 if token is invalid', async () => {
      const invalidToken = 'invalidToken';

      const newBlog = {
        title: 'Test Blog',
        author: 'John Doe',
        url: 'https://example.com',
        likes: 10
      };

      await api.post('/api/blogs')
        .set('Authorization', `Bearer ${invalidToken}`)
        .send(newBlog)
        .expect(401); // Expect 401 Unauthorized
    });
  });

  describe('DELETE /api/blogs/:id', () => {
    it('deletes a blog post by id', async () => {
      const newBlog = new Blog({
        title: 'Test Blog',
        author: 'John Doe',
        url: 'https://example.com',
        likes: 10,
        user: (await User.findOne())._id
      });
      const savedBlog = await newBlog.save();

      await api.delete(`/api/blogs/${savedBlog.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      const blogsInDb = await Blog.find({});
      assert.strictEqual(blogsInDb.length, 0);
    });

    it('returns 404 if blog id is not found', async () => {
      const invalidId = '669a3d9fc5ce3def241f50a9';
      await api.delete(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('PUT /api/blogs/:id', () => {
    it('updates likes of a blog post by id', async () => {
      const newBlog = new Blog({
        title: 'Test Blog',
        author: 'John Doe',
        url: 'https://example.com',
        likes: 10,
        user: (await User.findOne())._id
      });
      const savedBlog = await newBlog.save();

      const updatedBlogInfo = {
        likes: 15
      };

      const response = await api.put(`/api/blogs/${savedBlog.id}`)
      .set('Authorization', `Bearer ${authToken}`) // Include the token in the request header
        .send(updatedBlogInfo)
        .expect(200);

      assert.strictEqual(response.body.likes, updatedBlogInfo.likes);
    });

    it('returns 404 if blog id is not found', async () => {
      const invalidId = '669a3d9fc5ce3def241f50a9';
      const updatedBlogInfo = {
        likes: 20
      };

      await api.put(`/api/blogs/${invalidId}`)
      .set('Authorization', `Bearer ${authToken}`) // Include the token in the request header
        .send(updatedBlogInfo)
        .expect(404);
    });
  });
});
