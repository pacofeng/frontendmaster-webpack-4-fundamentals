import makeButton from './button';
import { makeColorStyle } from './button-styles';
import imageUrl from './li.jpg';
import makeImage from './image';
import './footer.css';
import './button.css';

const loadFooter = () => import('./footer');

// import * as G from 'gsap';
const getG = () => import('gsap');

if (process.env.NODE_ENV === 'development') {
  const setButtonStyle = (color) => import(/* webpackMode: 'lazy-once' */`./button-styles/${color}`);
} else {
  const setButtonStyle = (color) => import(`./button-styles/${color}`);
}

const button = makeButton('haha, new button');
button.style = makeColorStyle('cyan')
button.addEventListener('click', (e) => {
  loadFooter().then(footerModule => {
    document.body.appendChild(footerModule.footer);
  });

  getG().then(gModule => {
    console.log(gModule); 
  });

  setButtonStyle('purple').then(styleString => {
    button.style = styleString.default;
  })

});
document.body.appendChild(button);
document.body.appendChild(makeImage(imageUrl));