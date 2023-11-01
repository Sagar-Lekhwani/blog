var express = require('express');
var router = express.Router();
const axios = require('axios');
const _ = require('lodash');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/blog-stats', async function(req, res) {
  try {
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
      },
    });

  
    
    const blogs = response.data.blogs;
    const totalBlogs = blogs.length;
    const longestBlog = _.maxBy(blogs, 'title.length');
    const blogsWithPrivacy = blogs.filter(blog => blog.title.toLowerCase().includes('privacy'));
    const uniqueTitles = _.uniq(blogs.map(blog => blog.title));

  
    const statistics = {
      totalBlogs,
      longestBlog: longestBlog.title,
      blogsWithPrivacy: blogsWithPrivacy.length,
      uniqueTitles,
    };

    res.json(statistics);
  } catch (error) {
    console.error('Error while fetching or analyzing data:', error);
    res.status(500).json({ error: 'An error occurred while fetching and analyzing blog data.' });
  }
});

router.get('/api/blog-search', async (req, res) => {
  try {
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
      },
    });

  
    if (!response.data || !response.data.blogs) {
      return res.status(500).json({ error: 'Invalid response structure from the API.' });
    }

    const blogs = response.data.blogs;
    const query = req.query.query;
    const searchResults = blogs.filter(blog => blog.title.toLowerCase().includes(query.toLowerCase()));


    res.json(searchResults);
  } catch (error) {
    console.error('Error while searching for blogs:', error);
    res.status(500).json({ error: 'An error occurred while searching for blogs.' });
  }
});


module.exports = router;
