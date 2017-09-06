
// Imports

import * as _ from 'lodash';
import * as React from 'react';
import * as Leap from 'leapjs';

import { maths, Rect } from 'varyd-utils';


// Constants


// Class

export default class AppArea extends React.Component {

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

    let r = new Rect(
      this.props.appL,
      this.props.appT,
      this.props.appW,
      this.props.appH
    ).absolutized();

    return (

      <div
        className='appZone'
        style={{
          left:   r.x + 'px',
          top:    r.y + 'px',
          width:  r.w + 'px',
          height: r.h + 'px'
        }}>
      </div>

    );

  }


}
