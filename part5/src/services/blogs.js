import axios from 'axios';

// Base URL for API endpoints
const apiUrl = '/api/articles';

let authToken = null;

// Function to set the authentication token
const configureToken = (newToken) => {
  authToken = `Bearer ${newToken}`;
};

// Function to fetch all blogs
const fetchAllBlogs = () => {
  const request = axios.get(apiUrl);
  return request.then(response => response.data);
};

// Function to add a new blog
const addBlog = (blogDetails) => {
  const config = {
    headers: { Authorization: authToken },
  };

  const request = axios.post(apiUrl, blogDetails, config);
  return request
    .then(response => {
      return { data: response.data, status: response.status };
    })
    .catch(error => {
      return { status: error.response.status };
    });
};

// Function to update an existing blog
const modifyBlog = (blogUpdates) => {
  const request = axios.put(`${apiUrl}/${blogUpdates.id}`, blogUpdates);
  return request.then(response => response.data);
};

// Function to delete a blog
const deleteBlog = (id) => {
  const config = {
    headers: { Authorization: authToken },
  };

  const request = axios.delete(`${apiUrl}/${id}`, config);
  return request
    .then(response => response.status)
    .catch(error => error.response.status);
};

export default { fetchAllBlogs, configureToken, addBlog, modifyBlog, deleteBlog };
