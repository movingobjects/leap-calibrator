
// Imports

import * as _ from 'lodash';
import { arrays, maths, random } from 'varyd-utils';
import { Dispatcher, Range } from 'varyd-utils';

import * as Leap from 'leapjs';


// Constants


// Class

export default class LeapAgent extends Dispatcher {

  // Constructor

  constructor(options) {

    super();

    // Bindings
    this.handleLeapFrame = this.handleLeapFrame.bind(this);

    // Init boundaries
    this.rangeX = new Range(options.xMin, options.xMax);
    this.rangeY = new Range(options.yMin, options.yMax);
    this.rangeZ = new Range(options.zMin, options.zMax);

    this.leapRangeX = this.rangeX.clone();
    this.leapRangeY = this.rangeY.clone();
    this.leapRangeZ = this.rangeZ.clone();

    // Init Leap options
    this.leapOptions = { };

    if (options.host) this.leapOptions.host = options.host;
    if (options.port) this.leapOptions.port = options.port;

    // Enable
    if (options.enable === undefined || options.enable != false) {
      this.enable()
    }

  }


  // Get/set

  get xMin() {
    return this.rangeX.min;
  }
  get xMax() {
    return this.rangeX.max;
  }
  get yMin() {
    return this.rangeY.min;
  }
  get yMax() {
    return this.rangeY.max;
  }
  get zMin() {
    return this.rangeZ.min;
  }
  get zMax() {
    return this.rangeZ.max;
  }

  set xMin(val) {
    this.rangeX.min = val;
  }
  set xMax(val) {
    this.rangeX.max = val;
  }
  set yMin(val) {
    this.rangeY.min = val;
  }
  set yMax(val) {
    this.rangeY.max = val;
  }
  set zMin(val) {
    this.rangeZ.min = val;
  }
  set zMax(val) {
    this.rangeZ.max = val;
  }


  // Event handlers

  handleLeapFrame(frame) {

    const framePrev = this.leap.frame(1);

    if (!frame.hands.length && !framePrev.hands.length) {
      // No need to send events if no hands present
      return;
    }

    const hands = frame.hands.map((hand) => {

      let x = hand.indexFinger.distal.nextJoint[0],
          y = hand.indexFinger.distal.nextJoint[1],
          z = hand.indexFinger.distal.nextJoint[2];

      this.leapRangeX.envelop(x);
      this.leapRangeY.envelop(y);
      this.leapRangeZ.envelop(z);

      return {

        confidence: hand.confidence,

        x: x,
        y: y,
        z: z,

        percX: this.rangeX.norm(x),
        percY: this.rangeY.norm(y),
        percZ: this.rangeZ.norm(z),

        leapPercX: this.leapRangeX.norm(x),
        leapPercY: this.leapRangeY.norm(y),
        leapPercZ: this.leapRangeZ.norm(z),

        screenX: this.rangeX.mapTo(x, 0, screen.width),
        screenY: this.rangeY.mapTo(y, 0, screen.height),

        windowX: this.rangeX.mapTo(x, 0, screen.width ) - window.screenX,
        windowY: this.rangeY.mapTo(y, 0, screen.height) - window.screenY

      };

    });

    if (hands !== undefined) {
      super.dispatch('leapFrame', {
        hands: hands
      });
    }

  }


  // Methods

  enable() {
    this.leap = Leap.loop(this.leapOptions, this.handleLeapFrame);
  }
  disable() {
    this.leap = Leap.loop({}, null);
  }


}
