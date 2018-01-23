
// Imports

import * as _ from 'lodash';
import * as React from 'react';
import * as Leap from 'leapjs';
import classNames from 'classnames';

import { maths } from 'varyd-utils';


// Constants

const HOLD_DURATION = 1;
const MAX_MOVE_DIST = 50;
const STEPS_COUNT   = 4;


// Class

export default class Calibration extends React.Component {

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

  getMarkerPt() {

    let percX, percY;

    switch (this.props.step) {

      case 0:
        percX = 0.25;
        percY = 0.25;
        break;

      case 1:
        percX = 0.75;
        percY = 0.25;
        break;

      case 2:
        percX = 0.25;
        percY = 0.75;
        break;

      case 3:
        percX = 0.75;
        percY = 0.75;
        break;

    }

    return {
      x: maths.lerp(0, this.props.winW, percX),
      y: maths.lerp(0, this.props.winH, percY)
    }


  }


  // React

  render() {

    const x1 = maths.lerp(0, this.props.winW,      this.props.padPerc),
          x2 = maths.lerp(0, this.props.winW, (1 - this.props.padPerc)),
          y1 = maths.lerp(0, this.props.winH,      this.props.padPerc),
          y2 = maths.lerp(0, this.props.winH, (1 - this.props.padPerc));

    const pts = [
      { x: x1, y: y1 },
      { x: x2, y: y1 },
      { x: x1, y: y2 },
      { x: x2, y: y2 }
    ]

    return (

      <div
        className='calibration'>

        {pts.map((pt, i) => {

          let markerClasses = classNames({
            marker: true,
            complete: (i < this.props.step),
            current: (i == this.props.step) && (this.props.ready),
            registering: (i == this.props.step) && (this.props.ready) && (this.props.registering)
          })

          return (
            <div
              key={i}
              className={markerClasses}
              style={{
                left: pt.x,
                top: pt.y
              }}>
              &#x2714;
              </div>
          );

        })}

      </div>

    );

  }


}
