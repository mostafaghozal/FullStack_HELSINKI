import { useState } from 'react';

const PostForm = ({ // Updated component name
  onAddPost, // Updated prop name
}) => {
  const [postTitle, setPostTitle] = useState(''); // Updated state variables
  const [postAuthor, setPostAuthor] = useState('');
  const [postUrl, setPostUrl] = useState('');

  const handleSubmit = (event) => { // Renamed function
    event.preventDefault();
    onAddPost({ // Updated prop usage
      title: postTitle,
      author: postAuthor,
      url: postUrl,
    });
    setPostTitle('');
    setPostAuthor('');
    setPostUrl('');
  };

  return (
    <div>
      <h2>Create New Post</h2> {/* Updated heading */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Title:
            <input
              value={postTitle} // Updated value
              id='post-title' // Updated id
              name='title'
              onChange={({ target }) => setPostTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Author:
            <input
              value={postAuthor} // Updated value
              id='post-author' // Updated id
              name='author'
              onChange={({ target }) => setPostAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            URL:
            <input
              value={postUrl} // Updated value
              id='post-url' // Updated id
              name='url'
              onChange={({ target }) => setPostUrl(target.value)}
            />
          </label>
        </div>
        <button type='submit' id='submit-button'>Create Post</button> {/* Updated button text and id */}
      </form>
    </div>
  );
};

export default PostForm;
