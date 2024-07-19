// tests/users.test.js
const supertest = require('supertest');
const { app, server } = require('../app');
const User = require('../models/user');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
});

test('creation fails with too short username', async () => {
  const newUser = {
    username: 'ab',
    password: 'password',
    name: 'John Doe'
  };

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400);
});

// Add more tests to check various invalid and valid user scenarios
