import { useState } from 'react';
import PropTypes from 'prop-types';

// Blog component
const BlogPost = ({
  currentUser,
  post,
  onLikePost,
  onDeletePost
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Styling
  const containerStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  };

  // Show or hide details
  const hideDetailsStyle = { display: isVisible ? 'none' : '' };
  const showDetailsStyle = { display: isVisible ? '' : 'none' };
  const deleteButtonStyle = { display: currentUser === post.user.username ? '' : 'none' };

  // Handle like action
  const handleLikeClick = async (event) => {
    event.preventDefault();
    onLikePost(post);
  };

  // Handle delete action
  const handleDeleteClick = async (event) => {
    event.preventDefault();
    onDeletePost(post);
  };

  return (
    <div className='blog-post'>
      <div style={hideDetailsStyle}>
        <div style={containerStyle}>
          <div>
            {post.title} by {post.author}
            <button onClick={() => setIsVisible(true)}>view</button>
          </div>
        </div>
      </div>
      <div style={showDetailsStyle} className='detailed-info'>
        <div style={containerStyle}>
          <div>
            {post.title} by {post.author}
            <button onClick={() => setIsVisible(false)}>hide</button>
          </div>
          <div className='url'>{post.url}</div>
          <div className='likes'>
            likes {post.likes}
            <button onClick={handleLikeClick}>like</button>
          </div>
          <div>Added by {post.user.name}</div>
          <div style={deleteButtonStyle} className='delete-button'>
            <button onClick={handleDeleteClick}>remove</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Prop types
BlogPost.propTypes = {
  currentUser: PropTypes.string.isRequired,
  post: PropTypes.object.isRequired,
  onLikePost: PropTypes.func.isRequired,
  onDeletePost: PropTypes.func.isRequired
};

export default BlogPost;
