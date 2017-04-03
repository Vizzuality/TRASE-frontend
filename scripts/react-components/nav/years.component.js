import { h, Component } from 'preact';
import Dropdown from 'react-components/nav/dropdown.component';
import YearsThumb from './years-thumb.component';
import 'styles/components/nav/years-slider.scss';

const YEAR_WIDTH = 40;
const id = 'years';

export default class Years extends Component {
  constructor(props) {
    super(props);
    this.onSelectorMovedBound = this.onSelectorMoved.bind(this);
    this.onSelectorUpBound = this.onSelectorUp.bind(this);
    this.state = this.getState(props);
  }

  componentWillReceiveProps(props) {
    this.setState(this.getState(props));
  }

  getState({selectedYears, years}) {
    const left = YEAR_WIDTH * years.indexOf(selectedYears[0]);
    const right = YEAR_WIDTH * (years.indexOf(selectedYears[1]) + 1);
    return {
      left,
      right
    };
  }

  onSelectorDown(mouseEvent) {
    this.dragging = true;
    this.currentSelectorThumb = mouseEvent.target.getAttribute('data-thumb');
    document.addEventListener('mousemove', this.onSelectorMovedBound);
    document.addEventListener('mouseup', this.onSelectorUpBound);
  }

  onSelectorMoved(mouseEvent) {
    const sliderOffset = this.slider.getBoundingClientRect().left;
    const x = mouseEvent.clientX - sliderOffset;
    this.moveSelector(x);
  }

  onSelectorUp(mouseEvent) {
    this.dragging = false;
    mouseEvent.stopPropagation();
    document.removeEventListener('mousemove', this.onSelectorMovedBound);
    document.removeEventListener('mouseup', this.onSelectorUpBound);
    this.releaseSelector();
  }

  onDropdownUp() {
    if (this.dragging === true) {
      return;
    }
    this.props.onToggle(id);
  }

  moveSelector(x) {
    const deltaWidth = this.state.right - this.state.left;

    let left;
    let right;

    if (this.currentSelectorThumb === null) {
      left = x - deltaWidth/2;
      right = x + deltaWidth/2;
      if (left < 0) {
        left = 0;
        right = deltaWidth;
      } else if (right > this.totalWidth) {
        right = this.totalWidth;
        left = right - deltaWidth;
      }
    } else if (this.currentSelectorThumb === 'left') {
      // not after right thumb, not below 0
      left = Math.min(this.state.right, Math.max(0, x));
      right = this.state.right;
    } else if (this.currentSelectorThumb === 'right') {
      // not before left thumb, not above total width
      right = Math.max(this.state.left, Math.min(this.totalWidth, x));
      left = this.state.left;
    }
    this.setState({
      left,
      right
    });
  }

  releaseSelector() {
    let leftIndex = Math.round(this.state.left / YEAR_WIDTH);
    if (leftIndex === this.props.years.length) {
      leftIndex = this.props.years.length - 1;
    }

    let rightIndex = Math.max(0, Math.round(this.state.right / YEAR_WIDTH) - 1);
    if (rightIndex <= leftIndex) {
      rightIndex = leftIndex;
    }
    this.props.onSelected([this.props.years[leftIndex], this.props.years[rightIndex]]);
  }

  render({ currentDropdown, selectedYears, years }) {
    this.totalWidth = YEAR_WIDTH * years.length;
    const title = (selectedYears[0] === selectedYears[1]) ?
      <span>{selectedYears[0]}</span> :
      <span>{selectedYears[0]}&thinsp;-&thinsp;{selectedYears[1]}</span>;
    const totalWidthStyle = {width: `${this.totalWidth}px`};
    const deltaWidth = this.state.right - this.state.left;
    const selectorWidthStyle = {
      width: `${deltaWidth}px`,
      left: `${this.state.left}px`
    };
    return (
      <div class='nav-item js-dropdown' onMouseUp={() => { this.onDropdownUp(); }}>
        <div class='c-dropdown'>
          <span class='dropdown-label'>
            year{selectedYears[0] !== selectedYears[1] && <span>s</span>}
          </span>
          <span class='dropdown-title'>
            {title}
          </span>
          <Dropdown id={id} currentDropdown={currentDropdown} onClickOutside={this.props.onToggle}>
            <div class='dropdown-list'>
              <div class='c-years-slider' ref={(elem) => { this.slider = elem; }}>
                <ul class='background' style={totalWidthStyle}>
                  {years.map(() => <li />)}
                </ul>
                <div class='selector'
                  style={selectorWidthStyle}
                  onMouseDown={(mouseEvent) => { this.onSelectorDown(mouseEvent); }}
                >
                  <YearsThumb id='left' />
                  <YearsThumb id='right' x={deltaWidth} />
                </div>
                <ul class='years' style={totalWidthStyle}>
                  {years
                    .map(year => <li
                      >
                      {year}
                    </li>)}
                </ul>
              </div>
            </div>
          </Dropdown>
        </div>
      </div>
    );
  }
}
