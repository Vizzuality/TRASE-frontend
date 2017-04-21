import Nav from 'components/shared/nav.component.js';
import Slider from 'scripts/components/home/slider.component';
import PostsTemplate from 'ejs!templates/homepage/posts.ejs';
// import UpdatesTemplate from 'ejs!templates/homepage/updates.ejs';
import TweetsTemplate from 'ejs!templates/homepage/tweets.ejs';
import 'styles/homepage.scss';

const state = {
  activeIndex: 0,
  scrollTop: 0,
  texts: [
    {
      text: 'Trase transforms our understanding of how companies and governments involved in the trade of agricultural commodities are linked to impacts and opportunities for more sustainable production.',
      action: {
        text: 'explore the tool',
        href: '/flows.html'
      }
    },
    {
      text: 'Can companies and governments meet their 2020 sustainability goals? The blanket transparency provided by Trases helps address this question and identify priority actions for achieving success.',
      action: {
        text: 'explore company commitments',
        href: '/factsheets.html'
      }
    },
    {
      text: 'The ability to address deforestation and promote sustainability is hampered by poor access to vital information. Trase is committed to free and open access to all the information provided on the platform.',
      action: {
        text: 'download trase data',
        href: '/data.html'
      }
    }
  ],
  sliders: [
    {
      el: '.js-posts',
      selector: '.js-posts-slider',
      endpoint: API_CMS_URL + '/posts',
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
    {
      el: '.js-tweets',
      endpoint: API_SOCIAL + '/tweets',
      perPage: 3,
      template: TweetsTemplate
    }
  ]
};


const renderSlider = ({ el, selector, endpoint, perPage, next, template }) => {
  fetch(endpoint)
    .then(response => response.json())
    .then((data) => template({ posts: data }))
    .then((slides) => {
      document.querySelector(el).insertAdjacentHTML('beforeend', slides);
      new Slider({ selector, perPage, next });
    });
};

const getPageOffset = (bounds) => {
  const body = document.querySelector('body').getBoundingClientRect();
  const padding = 65;
  const navHeight = 64;
  return Math.abs(body.top) + Math.abs(bounds.top) - padding - navHeight;
};

const scrollIntro = () => {
  const sections = document.querySelectorAll('.js-scroll-change');
  const offsets = Array.prototype.map.call(sections, (section) => section.getBoundingClientRect().top);
  const direction = (state.scrollTop < window.scrollY) ? 1 : -1;
  let index = state.activeIndex;

  if (offsets[state.activeIndex + 1] < window.innerHeight / 2 && direction === 1) index += direction;
  if (offsets[state.activeIndex] > window.innerHeight / 2 && direction === -1) index += direction;


  state.scrollTop = window.scrollY;

  if(typeof offsets[index] === 'undefined') return;
  if (state.activeIndex !== index) {
    const intro = document.querySelector('.js-intro-statement');
    const { text, action } = state.texts[index];
    const actionNode = intro.querySelector('.js-action');

    state.activeIndex = index;

    intro.querySelector('.js-text').innerText = text;

    actionNode.setAttribute('href', action.href);
    actionNode.innerText = action.text;
  }
};

const init = () => {
  const bounds = document.querySelector('.js-content-section').getBoundingClientRect();
  const pageOffset = getPageOffset(bounds);
  new Nav({ pageOffset });

  state.sliders.forEach(renderSlider);

  window.addEventListener('scroll', scrollIntro);
};

init();
