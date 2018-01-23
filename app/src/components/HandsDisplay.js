
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


  // React

  render() {

    return (

      <ul className='hands'>
        {this.props.hands.map((handStyle, i) => (
          <li
            key={i}
            className='hand'
            style={handStyle}></li>
        ))}
      </ul>

    );

  }


}
