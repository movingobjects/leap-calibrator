
// Imports

import * as _ from 'lodash';
import * as React from 'react';
import * as Leap from 'leapjs';

import { maths } from 'varyd-utils';


// Constants


// Class

export default class HandsDisplay extends React.Component {

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


  // React lifecycle

  render() {

    return (

      <ul className='hands'>
        {this.props.hands.map((hand, i) => (
          <li
            key={i}
            className='hand'
            style={{
              backgroundColor: hand.color,
              left: hand.x + 'px',
              top: hand.y + 'px'
            }}></li>
        ))}
      </ul>

    );

  }


}
