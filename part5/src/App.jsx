import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import BlogForm from './components/BlogForm';

const Alert = ({ info }) => {
  if (!info.content) return null;

  const alertClass = info.isError ? 'alert-error' : 'alert-success';

  return (
    <div className={alertClass}>
      {info.content}
    </div>
  );
};

const App = () => {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [notification, setNotification] = useState({
    content: '',
    isError: false
  });
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await blogService.getAll();
      setPosts(fetchedPosts.sort((a, b) => b.likes - a.likes));
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const storedUser = window.localStorage.getItem('loggedBloglistUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const loginUser = async (event) => {
    event.preventDefault();
    try {
      const loggedInUser = await loginService.login({ inputUsername, inputPassword });
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(loggedInUser));
      setCurrentUser(loggedInUser);
      blogService.setToken(loggedInUser.token);
      setInputUsername('');
      setInputPassword('');
    } catch (error) {
      setNotification({ content: 'Invalid username or password', isError: true });
      setTimeout(() => setNotification({ content: '', isError: false }), 5000);
    }
  };

  const logoutUser = (event) => {
    event.preventDefault();
    window.localStorage.removeItem('loggedBloglistUser');
    setCurrentUser(null);
  };

  const createNewBlog = async ({ title, author, url }) => {
    const newBlog = { title, author, url };
    const response = await blogService.create(newBlog);
    if (response.status === 201) {
      const blogData = response.data;
      blogData.user = currentUser;
      setPosts(posts.concat(blogData));
      setNotification({ content: `A new blog "${blogData.title}" by ${blogData.author} added`, isError: false });
      setTimeout(() => setNotification({ content: '', isError: false }), 5000);
    } else {
      setNotification({ content: `Failed to add a new blog "${newBlog.title}" by ${newBlog.author}`, isError: true });
      setTimeout(() => setNotification({ content: '', isError: false }), 5000);
    }
  };

  const likeBlog = async (blogData) => {
    blogData.likes += 1;
    const originalUser = blogData.user;
    blogData.user = blogData.user.id;
    const updatedBlog = await blogService.update(blogData);
    updatedBlog.user = originalUser;
    setPosts(posts
      .filter(blog => blog.id !== updatedBlog.id)
      .concat(updatedBlog)
      .sort((a, b) => b.likes - a.likes)
    );
  };

  const removeBlog = async (blogData) => {
    const confirmDeletion = window.confirm(`Remove blog "${blogData.title}" by ${blogData.author}?`);
    if (!confirmDeletion) return;

    const deleteStatus = await blogService.remove(blogData.id);
    if (deleteStatus === 204) {
      setPosts(posts
        .filter(blog => blog.id !== blogData.id)
        .sort((a, b) => b.likes - a.likes)
      );
    } else {
      setNotification({ content: `Failed to delete "${blogData.title}" by ${blogData.author}`, isError: true });
      setTimeout(() => setNotification({ content: '', isError: false }), 5000);
    }
  };

  const renderBlogForm = () => {
    const formStyle = { display: isFormVisible ? '' : 'none' };
    const buttonStyle = { display: isFormVisible ? 'none' : '' };

    return (
      <div>
        <div style={buttonStyle}>
          <button onClick={() => setIsFormVisible(true)}>New Blog</button>
        </div>
        <div style={formStyle}>
          <BlogForm handleCreateBlog={createNewBlog} />
          <button onClick={() => setIsFormVisible(false)}>Cancel</button>
        </div>
      </div>
    );
  };

  if (!currentUser) {
    return (
      <div>
        <h2>Login to Your Account</h2>
        <Alert info={notification} />
        <form onSubmit={loginUser}>
          <div>
            Username
            <input type="text" id='username-input' value={inputUsername} name="Username" onChange={({ target }) => setInputUsername(target.value)} />
          </div>
          <div>
            Password
            <input type="password" id='password-input' value={inputPassword} name="Password" onChange={({ target }) => setInputPassword(target.value)} />
          </div>
          <button type="submit" id='login-btn'>Sign In</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Alert info={notification} />
      <div>
        {currentUser.name} logged in
        <button onClick={logoutUser}>Logout</button>
      </div>
      <br />
      {renderBlogForm()}
      {posts.map(blog =>
        <Blog
          key={blog.id}
          loggedUser={currentUser.username}
          blog={blog}
          handleBlogLike={likeBlog}
          handleRemoveBlog={removeBlog}
        />
      )}
    </div>
  );
};

export default App;
