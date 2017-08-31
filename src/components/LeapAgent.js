
// Imports
/////////////////////////////////////////////

import * as _ from 'lodash';
import { arrays, maths, random } from 'varyd-utils';
import { Dispatcher } from 'varyd-utils';

import * as Leap from 'leapjs';


// Constants
/////////////////////////////////////////////


// Class
/////////////////////////////////////////////

export default class LeapAgent extends Dispatcher {

  // Constructor
  /////////////////////////////////////////////

  constructor() {

    super();

    this.stabalized = false;

    this.leap = Leap.loop({}, (f) => {
      this.handleLeapFrame(f);
    });

  }


  // Getters & setters
  /////////////////////////////////////////////


  // Event handlers
  /////////////////////////////////////////////

  handleLeapFrame(frame) {

    const framePrev      = this.leap.frame(1);

    if (!frame.hands.length && !framePrev.hands.length) {
      // No need to send events if no hands present
      return;
    }

    const hands   = frame.hands.map((hand) => {

      let posX  = this.stabalized ? hand.stabilizedPalmPosition[0] : hand.palmPosition[0],
          posY  = this.stabalized ? hand.stabilizedPalmPosition[1] : hand.palmPosition[1],
          posZ  = this.stabalized ? hand.stabilizedPalmPosition[2] : hand.palmPosition[2];

      if (isNaN(this.xMin) || posX < this.xMin) this.xMin = posX;
      if (isNaN(this.xMax) || posX > this.xMax) this.xMax = posX;

      if (isNaN(this.yMin) || posY < this.yMin) this.yMin = posY;
      if (isNaN(this.yMax) || posY > this.yMax) this.yMax = posY;

      if (isNaN(this.zMin) || posZ < this.zMin) this.zMin = posZ;
      if (isNaN(this.zMax) || posZ > this.zMax) this.zMax = posZ;

      let x = maths.norm(posX, this.xMin, this.xMax),
          y = maths.norm(posY, this.yMin, this.yMax),
          z = maths.norm(posZ, this.zMin, this.zMax);

      if (isNaN(x) || isNaN(y) || isNaN(z)) {
        return undefined;
      }

      return {
        confidence: hand.confidence,
        x: x,
        y: y,
        z: z,
        screenX:  x * screen.width,
        screenY:  y * screen.height,
        windowX: (x * screen.width ) - window.screenX,
        windowY: (y * screen.height) - window.screenY
      };

    });

    if (hands !== undefined) {
      super.dispatch('leapFrame', {
        hands: hands
      });
    }

  }


  // Methods
  /////////////////////////////////////////////


}
