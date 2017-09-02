
// Imports

import * as _ from 'lodash';
import * as $ from 'jquery';
import * as React from 'react';
import * as Leap from 'leapjs';

import screenfull from 'screenfull';

import { maths, Rect } from 'varyd-utils';
import LeapAgent from './LeapAgent';
import ControlsPanel from './ControlsPanel';
import HandsDisplay from './HandsDisplay';
import AppArea from './AppArea';


// Constants

const DEF_APP_MIN_X     = -300,
      DEF_APP_MIN_Y     = 430,
      DEF_APP_MAX_X     = 250,
      DEF_APP_MAX_Y     = 135;


// Class

export default class App extends React.Component {

  // Constructor

  constructor() {

    super();

    this.initState();
    this.initBindings();
    this.initLeap();
    this.initFullscreen();

  }

  initState() {

    this.state = {
      hands: [],
      fullscreen: false,
      showLeapZone: false,
      invertX: false,
      invertY: true,
      appMinX: DEF_APP_MIN_X,
      appMinY: DEF_APP_MIN_Y,
      appMaxX: DEF_APP_MAX_X,
      appMaxY: DEF_APP_MAX_Y,
      leapMinX: 0,
      leapMinY: 0,
      leapMaxX: 1,
      leapMaxY: 1,
    }
  }

  initBindings() {

    this.handleKeyDown                  = this.handleKeyDown.bind(this);
    this.handleControlChange            = this.handleControlChange.bind(this);
    this.handleFullScreenCheckboxChange = this.handleFullScreenCheckboxChange.bind(this);
    this.handleInvertAxisChange         = this.handleInvertAxisChange.bind(this);

  }

  initLeap() {

    this.leap = new LeapAgent();
    this.leap.addListener('leapFrame', this.handleLeapFrame.bind(this));
    this.leap.addListener('zoneUpdate', this.handleLeapZoneUpdate.bind(this));

  }

  initFullscreen() {

    if (screenfull.enabled) {
      screenfull.on('change', () => {
        this.forceUpdate();
      });
    }

  }


  // Event handlers

  handleKeyDown(e) {

    switch (e.key) {

      case 'f':
        this.setState({
          fullscreen: !this.state.fullscreen
        });
        break;

      case 'l':
        this.setState({
          showLeapZone: !this.state.showLeapZone
        });
        break;

    }

  }

  handleLeapFrame(e) {

    this.setState({
      hands: e.hands
    })

  }

  handleLeapZoneUpdate(e) {

    this.setState({
      leapMinX: Math.round(this.leap.xMin),
      leapMinY: Math.round(this.leap.yMin),
      leapMaxX: Math.round(this.leap.xMax),
      leapMaxY: Math.round(this.leap.yMax)
    });

  }

  handleControlChange(e) {

    const val   = (e.target.type === 'checkbox') ? e.target.checked : Number(e.target.value),
          name  = e.target.name;

    this.setState({
      [name]: val
    });

  }

  handleFullScreenCheckboxChange(e) {

    if (!screenfull.enabled) return;

    this.setState({
      fullscreen: e.target.checked
    });

  }

  handleInvertAxisChange(e) {

    switch (e.target.name) {

      case 'invertX':
        this.setState({
          invertX: !this.state.invertX,
          appMinX: this.state.appMaxX,
          appMaxX: this.state.appMinX
        });
        break;

      case 'invertY':
        this.setState({
          invertY: !this.state.invertY,
          appMinY: this.state.appMaxY,
          appMaxY: this.state.appMinY
        });
        break;

    }
  }


  // Methods

  requestFullscreen(el) {
    return el.requestFullscreen || el.msRequestFullscreen || el.mozRequestFullScreen || el.webkitRequestFullscreen;
  }

  getAppAreaRect() {

    const showLeapZone  = this.state.showLeapZone,
          winW          = window.innerWidth,
          winH          = window.innerHeight;

    const x = Math.round(showLeapZone ? maths.map(this.state.appMinX, this.state.leapMinX, this.state.leapMaxX, 0, winW) : 0),
          y = Math.round(showLeapZone ? maths.map(this.state.appMinY, this.state.leapMinY, this.state.leapMaxY, 0, winH) : 0),
          r = Math.round(showLeapZone ? maths.map(this.state.appMaxX, this.state.leapMinX, this.state.leapMaxX, 0, winW) : winW),
          b = Math.round(showLeapZone ? maths.map(this.state.appMaxY, this.state.leapMinY, this.state.leapMaxY, 0, winH) : winH);

    return new Rect(x, y, r - x, b - y);

  }

  getHandsViewData() {

    const showLeapZone = this.state.showLeapZone;

    const rectLeap = new Rect(
      this.state.leapMinX,
      this.state.leapMinY,
      this.state.leapMaxX - this.state.leapMinX,
      this.state.leapMaxY - this.state.leapMinY
    );
    const rectApp  = new Rect(
      this.state.appMinX,
      this.state.appMinY,
      this.state.appMaxX - this.state.appMinX,
      this.state.appMaxY - this.state.appMinY
    );
    const rectWin  = new Rect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );

    let hands = [];

    for (let i = 0; i < this.state.hands.length; i++) {

      let hand   = this.state.hands[i];

      if (!hand) continue;

      let hue   = maths.lerp(0, 120, hand.confidence),
          hx,
          hy;

      if (showLeapZone) {
        hx  = rectWin.lerpX(rectLeap.normX(hand.x));
        hy  = rectWin.lerpY(rectLeap.normY(hand.y));
      } else {
        hx  = rectWin.lerpX(rectApp.normX(hand.x));
        hy  = rectWin.lerpY(rectApp.normY(hand.y));
      }

      // console.log("getHandsViewData");
      // console.log(`\thand.x: ${Math.round(hand.x)}\t(${Math.round(hand.percX * 100)}%)\t${hx}`);
      // console.log(`\thand.y: ${Math.round(hand.y)}\t(${Math.round(hand.percY * 100)}%)\t${hy}`);

      let anyBadVals  = isNaN(hue) || isNaN(hx) || isNaN(hy);

      if (!anyBadVals) {
        hands.push({
          color: `hsl(${hue}, 100%, 50%)`,
          x: Math.round(hx),
          y: Math.round(hy)
        });
      }

    }

    return hands;

  }


  // React lifecycle

  render() {

    const rectApp    = this.getAppAreaRect(),
          hands      = this.getHandsViewData();

    return (

      <div className='app'>

        <AppArea
          appL={rectApp.x}
          appT={rectApp.y}
          appW={rectApp.w}
          appH={rectApp.h} />

        {(hands.length > 0) && (
          <HandsDisplay
            hands={hands} />
        )}

        <ControlsPanel
          fullscreen={this.state.fullscreen}
          showLeapZone={this.state.showLeapZone}
          invertX={this.state.invertX}
          invertY={this.state.invertY}
          appMinX={this.state.appMinX}
          appMinY={this.state.appMinY}
          appMaxX={this.state.appMaxX}
          appMaxY={this.state.appMaxY}
          leapMinX={this.state.leapMinX}
          leapMinY={this.state.leapMinY}
          leapMaxX={this.state.leapMaxX}
          leapMaxY={this.state.leapMaxY}
          onControlChange={this.handleControlChange}
          onInvertAxisChange={this.handleInvertAxisChange}
          onFullScreenCheckboxChange={this.handleFullScreenCheckboxChange} />

      </div>

    );

  }

  componentDidUpdate() {

    if (this.state.fullscreen) {
      if (!screenfull.isFullscreen) {
        screenfull.request(document.body);
      }
    } else {
      if (screenfull.isFullscreen) {
        screenfull.exit();
      }
    }

  }

  componentDidMount() {

    this.$doc   = $(document);
    this.$win   = $(window);
    this.$body  = $('body');

    window.addEventListener('keydown', this.handleKeyDown);

  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }


}
