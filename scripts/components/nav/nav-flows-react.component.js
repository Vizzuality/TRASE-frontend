import { h } from 'preact';

const Nav = ({ onTodoClick, text }) => (
  <li
    onClick={() => onTodoClick('pouettt')}
  >
    {text}DFGHJKLKJHGF
  </li>

);

export default Nav;
