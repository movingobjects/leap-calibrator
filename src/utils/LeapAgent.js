
// Imports

import * as _ from 'lodash';
import { arrays, maths, random } from 'varyd-utils';
import { Dispatcher } from 'varyd-utils';

import * as Leap from 'leapjs';


// Constants


// Class

export default class LeapAgent extends Dispatcher {

  // Constructor

  constructor() {

    super();

    this.leap = Leap.loop({}, (f) => {
      this.handleLeapFrame(f);
    });

  }


  // Getters & setters

  get xMin() {
    return this._xMin;
  }
  get xMax() {
    return this._xMax;
  }
  set xMin(val) {
    this._xMin  = val;
    super.dispatch('zoneUpdate');
  }
  set xMax(val) {
    this._xMax  = val;
    super.dispatch('zoneUpdate');
  }

  get yMin() {
    return this._yMin;
  }
  get yMax() {
    return this._yMax;
  }
  set yMin(val) {
    this._yMin  = val;
    super.dispatch('zoneUpdate');
  }
  set yMax(val) {
    this._yMax  = val;
    super.dispatch('zoneUpdate');
  }

  get zMin() {
    return this._zMin;
  }
  get zMax() {
    return this._zMax;
  }
  set zMin(val) {
    this._zMin  = val;
    super.dispatch('zoneUpdate');
  }
  set zMax(val) {
    this._zMax  = val;
    super.dispatch('zoneUpdate');
  }


  // Event handlers

  handleLeapFrame(frame) {

    const framePrev      = this.leap.frame(1);

    if (!frame.hands.length && !framePrev.hands.length) {
      // No need to send events if no hands present
      return;
    }

    const hands   = frame.hands.map((hand) => {

      let x  = hand.indexFinger.distal.nextJoint[0],
          y  = hand.indexFinger.distal.nextJoint[1],
          z  = hand.indexFinger.distal.nextJoint[2];

      if (isNaN(x) || isNaN(y) || isNaN(z)) {
        return undefined;
      }

      this.updateZone(x, y, z);

      let percX = maths.norm(x, this.xMin, this.xMax),
          percY = maths.norm(y, this.yMin, this.yMax),
          percZ = maths.norm(z, this.zMin, this.zMax);

      return {

        confidence: hand.confidence,

        x: x,
        y: y,
        z: z,

        percX: percX,
        percY: percY,
        percZ: percZ,

        screenX: percX * screen.width,
        screenY: percY * screen.height,

        windowX: (percX * screen.width ) - window.screenX,
        windowY: (percY * screen.height) - window.screenY

      };

    });

    if (hands !== undefined) {
      super.dispatch('leapFrame', {
        hands: hands
      });
    }

  }


  // Methods

  updateZone(x, y, z) {

    if (this.xMin === undefined) this.xMin = x;
    if (this.xMax === undefined) this.xMax = x;
    if (this.yMin === undefined) this.yMin = y;
    if (this.yMax === undefined) this.yMax = y;
    if (this.zMin === undefined) this.zMin = z;
    if (this.zMax === undefined) this.zMax = z;

    if (x < this.xMin) this.xMin = x;
    if (x > this.xMax) this.xMax = x;
    if (y < this.yMin) this.yMin = y;
    if (y > this.yMax) this.yMax = y;
    if (z < this.zMin) this.zMin = z;
    if (z > this.zMax) this.zMax = z;

  }


}
