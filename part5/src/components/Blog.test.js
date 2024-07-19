import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogPost from './Blog'; // Updated component name to BlogPost

describe('<BlogPost />', () => {
  let container;
  const mockLikeHandler = jest.fn(); // Renamed handler function
  const currentUser = 'mluukkai'; // Renamed variable
  const post = { // Renamed blog to post
    title: 'Things I Don\'t Know as of 2018',
    author: 'Dan Abramov',
    url: 'https://overreacted.io/things-i-dont-know-as-of-2018/',
    likes: 10,
    user: {
      id: '653e919a2d75dec3018c9653',
      username: 'mluukkai',
      name: 'Matti Luukkainen'
    },
    id: '65748f2aec70f585cc66c103'
  };

  beforeEach(() => {
    container = render(<BlogPost // Updated component name to BlogPost
      currentUser={currentUser} // Renamed variable
      post={post} // Renamed prop
      onLikePost={mockLikeHandler} // Renamed prop
      onDeletePost={() => {}} // Renamed prop
    />).container;
  });

  test('url and likes are not visible by default', () => {
    const detailedSection = container.querySelector('.detailed-info'); // Updated class name
    expect(detailedSection).toHaveStyle('display: none');
  });

  test('url and likes become visible when \'view\' button is clicked', async () => {
    const user = userEvent.setup();
    const viewButton = screen.getByText('view');
    await user.click(viewButton);
    const detailedSection = container.querySelector('.detailed-info'); // Updated class name
    expect(detailedSection).not.toHaveStyle('display: none');
  });

  test('like button handler is called twice when clicked twice', async () => {
    const user = userEvent.setup();
    const likeButton = screen.getByText('like');
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockLikeHandler.mock.calls).toHaveLength(2);
  });
});
