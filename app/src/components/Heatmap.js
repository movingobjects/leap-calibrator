
// Imports

import * as _ from 'lodash';
import * as React from 'react';
import * as Leap from 'leapjs';

import { maths } from 'varyd-utils';


// Constants

// Class

export default class Heatmap extends React.Component {

  // Constructor

  constructor() {

    super();

    this.initState();
    this.initBindings();

  }

  initState() { }

  initBindings() { }


  // Event handlers


  // Methods

  getLeft(index) {
    const col   = (index % this.props.colCount);
    return Math.round(((col + 0.5) / this.props.colCount) * window.innerWidth);

  }
  getTop(index) {
    const row = Math.floor(index / this.props.colCount);
    return Math.round(((row + 0.5) / this.props.rowCount) * window.innerHeight);
  }

  // React

  render() {

    return (

      <ul className='heatmap'>
        {this.props.data.map((amt, i) => (
          <li
            key={i}
            style={{
              left: this.getLeft(i) + 'px',
              top: this.getTop(i) + 'px',
              backgroundColor: `hsl(${maths.lerp(0, 140, amt)}, 100%, 50%)`
            }} />
        ))}

      </ul>

    );

  }


}
