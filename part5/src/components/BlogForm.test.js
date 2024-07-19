import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PostForm from './PostForm'; // Updated import

describe('<PostForm />', () => { // Updated component name
  test('create new post', async () => { // Updated test description
    const onAddPost = jest.fn(); // Updated prop name
    const user = userEvent.setup();
    render(<PostForm onAddPost={onAddPost} />); // Updated component and prop name
    const title = screen.getByLabelText('Title:'); // Updated label text
    const author = screen.getByLabelText('Author:'); // Updated label text
    const url = screen.getByLabelText('URL:'); // Updated label text
    const createButton = screen.getByText('Create Post'); // Updated button text

    await user.type(title, 'The Joel Test: 12 Steps to Better Code');
    await user.type(author, 'Joel Spolsky');
    await user.type(url, 'https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/');
    await user.click(createButton);

    expect(onAddPost.mock.calls).toHaveLength(1); // Updated prop name
    expect(onAddPost.mock.calls[0][0]).toEqual({
      title: 'The Joel Test: 12 Steps to Better Code',
      author: 'Joel Spolsky',
      url: 'https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/'
    });
  });
});
