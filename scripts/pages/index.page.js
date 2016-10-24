
import Dropdown from 'scripts/components/dropdown.component';

import 'whatwg-fetch';
import PostGridTemplate from 'ejs!templates/homepage/post-grid.ejs';

import 'styles/homepage.scss';

const defaults = {
  commodity: 'Soy',
  country: 'Brazil',
  postsPerColumn: 4
};

const _setMap = () => {
  const imagesItem = document.querySelectorAll('.map-gallery-item');
  const commodity = defaults.commodity.toLowerCase();
  const country = defaults.country.toLowerCase();
  const imageName = `${commodity}-${country}`;

  imagesItem.forEach((imageItem) => {
    if (imageItem.getAttribute('data-image-name') === imageName) {
      imageItem.classList.remove('is-hidden');
    } else {
      if (!imageItem.classList.contains('is-hidden')) {
        imageItem.classList.add('is-hidden');
      }
    }
  });
};


const _onSelect = function(value) {
  // updates dropdown's title with new value
  this.setTitle(value);
  // updates default values with incoming ones
  defaults[this.id] = value;

  // change map image based on new values
  _setMap();
};

const _containsVerticalPost = (posts) => {
  return posts.filter((post) => post.verticalPost).length > 0 ? true : false;
};

const _getVerticalPost = (posts) => {
  return posts.filter((post) => post.verticalPost);
};

const _removeVerticalPosts = (posts) => {
  posts.forEach((post) => {
    if (post.verticalPost) {
      const index = posts.indexOf(post);
      posts.splice(index, 1);
    }
  });
};

const _getPosts = () => {
  const postList = document.querySelector('.js-posts-grid');

  fetch('homepage/posts.json')
    .then(response => response.json())
    .then((data) => {
      let posts = data.posts;
      const totalPosts = data['total_posts'];
      let postsPerColumn = defaults.postsPerColumn;
      let isLeft = true;
      let rows;

      if (!totalPosts) return;

      // get number of highlighted posts. This number indicates the number of rows;
      const highlightPosts = posts.filter((post) => post.highlighted);
      const graphtPosts = posts.filter((post) => post.verticalPost);

      // remove highlighted and graph posts from post array.
      posts.forEach((post) => {
        if (post.highlighted) {
          const index = posts.indexOf(post);
          posts.splice(index, 1);
        }
      });

      // sorts posts by date
      posts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

      rows = ((totalPosts - (highlightPosts.length * 5)) / 8 ) + highlightPosts.length;

      if (rows > Math.trunc(rows)) {
        rows = Math.trunc(rows) + 1;
      }

      for (let i = 0; i < rows; i++) {
        const highlightPost = highlightPosts[i];
        const graphtPost = graphtPosts[i];
        let leftSidePosts = [];
        let rightSidePosts = [];
        let leftVerticalPosts = [];
        let rightVerticalPosts = [];

        // set post number based on existence of graphPost
        postsPerColumn = graphtPost !== undefined ? 3 : defaults.postsPerColumn;

        // left side
        // left side is only filled with posts if there's no highlighted post
        if (highlightPost === undefined) {

          leftSidePosts = posts.splice(0, postsPerColumn);

          // if the number of posts is lower than the minimum (postsPerColumn)
          // fills the rest of gaps with empty objects
          if (leftSidePosts.length !== postsPerColumn) {

            for (let i = leftSidePosts.length; i < postsPerColumn; i++) {
              leftSidePosts.push({});
            }
          }
        }

        // right side
        rightSidePosts = posts.splice(0, postsPerColumn);

        if (rightSidePosts.length !== postsPerColumn) {
          for (let i = rightSidePosts.length; i < postsPerColumn; i++) {
            rightSidePosts.push({});
          }
        }

        // finds out if there is some vertical post in every side
        const leftSideVertical = _containsVerticalPost(leftSidePosts);
        const rightSideVertical = _containsVerticalPost(rightSidePosts);

        // Gets vertical posts
        if (leftSideVertical) {
          leftVerticalPosts = _getVerticalPost(leftSidePosts);
        }

        if (rightSideVertical) {
          rightVerticalPosts = _getVerticalPost(rightSidePosts);
        }

        // Removes vertical posts from current post array
        // Vertical post are instanced in another variable
        // to allow control the grid
        _removeVerticalPosts(leftSidePosts);
        _removeVerticalPosts(rightSidePosts);

        // alternates the position of the highlighted post in every row
        if (highlightPost !== undefined) {
          highlightPost.position = isLeft ? '-left' : '-right';
          isLeft = !isLeft;
        }

        const postsPerRow = PostGridTemplate({
          highlightPost,
          verticalLeft: {
            leftSideVertical,
            verticalPosts: leftVerticalPosts
          },
          verticalRight: {
            rightSideVertical,
            verticalPosts: rightVerticalPosts
          },
          posts: {
            left: leftSidePosts,
            right: rightSidePosts,
          }
        });

        postList.insertAdjacentHTML('beforeEnd', postsPerRow);
      }
    });
};

const commodityDropdown = new Dropdown('commodity', _onSelect);
const countryDropdown = new Dropdown('country', _onSelect);

commodityDropdown.setTitle(defaults.commodity);
countryDropdown.setTitle(defaults.country);
_setMap();
_getPosts();
