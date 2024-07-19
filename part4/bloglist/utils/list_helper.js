const dummy = (blogs) => {
    return 1;
  }
  
  const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
  }
  
  const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null;
  
    return blogs.reduce((prev, current) => {
      return (prev.likes > current.likes) ? prev : current;
    });
  }
  
  const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null;
  
    const authors = blogs.reduce((acc, blog) => {
      acc[blog.author] = (acc[blog.author] || 0) + 1;
      return acc;
    }, {});
  
    const maxBlogs = Math.max(...Object.values(authors));
    const author = Object.keys(authors).find(author => authors[author] === maxBlogs);
  
    return {
      author: author,
      blogs: maxBlogs
    };
  }
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
  }  