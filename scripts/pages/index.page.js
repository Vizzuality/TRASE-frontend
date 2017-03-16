import Nav from 'components/nav.component.js';
import Slider from 'scripts/components/shared/slider.component';
import PostsTemplate from 'ejs!templates/homepage/posts.ejs';
// import UpdatesTemplate from 'ejs!templates/homepage/updates.ejs';
// import TweetsTemplate from 'ejs!templates/homepage/tweets.ejs';
import 'styles/homepage.scss';

const state = {
  sliders: [
    {
      el: document.querySelector('.js-posts'),
      selector: '.js-posts-slider',
      endpoint: '/posts',
      template: PostsTemplate,
      perPage: 3,
      next: '.js-posts-next'
    },
    // {
    //   el: '.js-updates',
    //   endpoint: '/updates',
    //   perPage: 4,
    //   template: UpdatesTemplate
    // },
    // {
    //   el: '.js-tweets',
    //   endpoint: '/tweets',
    //   perPage: 3,
    //   template: TweetsTemplate
    // }
  ]
};


const renderSlider = ({ el, selector, endpoint, perPage, next, template }) => {
  fetch(API_CMS_URL + endpoint)
    .then(response => response.json())
    .then((data) => template({ posts: data }))
    .then((slides) => {
      el.insertAdjacentHTML('beforeend', slides);
      setTimeout(() => {new Slider({ selector, perPage, next })});
    });
};

const getPageOffset = () => {
  const body = document.querySelector('body').getBoundingClientRect();
  const content = document.querySelector('.js-content-section').getBoundingClientRect();
  const padding = 65;
  const navHeight = 64;
  return Math.abs(body.top) + Math.abs(content.top) - padding - navHeight;
};

const _init = () => {
  const pageOffset = getPageOffset();
  new Nav({ pageOffset });

  state.sliders.forEach(renderSlider);
};

_init();