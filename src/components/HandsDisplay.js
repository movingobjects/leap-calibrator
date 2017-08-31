
// Imports

import * as _ from 'lodash';
import * as $ from 'jquery';
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

    const hands = [];

    for (let i = 0; i < this.props.hands.length; i++) {

      let hand   = this.props.hands[i];

      if (!hand) continue;

      let percX     = this.props.invertX ? (1 - hand.x) : hand.x,
          percY     = this.props.invertY ? (1 - hand.y) : hand.y,
          percZ     = this.props.invertZ ? (1 - hand.z) : hand.z,
          hue       = maths.lerp(0, 120, hand.confidence);

      hands.push({
        color: `hsl(${hue}, 100%, 50%)`,
        x: Math.round(maths.lerp(0, window.innerWidth, percX)),
        y: Math.round(maths.lerp(0, window.innerHeight, percY)),
        size: Math.round(maths.lerp(0, 100, percZ))
      });

    }

    return (

      <ul className='hands'>
        {hands.map((hand, i) => (
          <li
            key={i}
            className='hand'
            style={{
              'backgroundColor': hand.color,
              'left': hand.x,
              'top': hand.y,
              'width': hand.size,
              'height': hand.size
            }}
            >
          </li>
        ))}
      </ul>

    );

  }


}
