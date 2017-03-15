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

const _init = () => {
  const content = document.querySelector('.-content');
  const nav = new Nav({
    pageOffset: content.getBoundingClientRect().top
  });
  nav.onCreated();
  state.sliders.forEach(renderSlider);
};

_init();