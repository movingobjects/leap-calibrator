
// Imports

import * as _ from 'lodash';
import * as React from 'react';
import * as Leap from 'leapjs';

import screenfull from 'screenfull';

import { maths, Rect, Span } from 'varyd-utils';
import LeapAgent from '../utils/LeapAgent';

import ControlsPanel from './ControlsPanel';
import HandsDisplay from './HandsDisplay';
import Calibration from './Calibration';


// Constants

const CALIBRATION_STEPS         = 4,
      CALIBRATION_HOLD_DURATION = 1,
      CALIBRATION_MAX_MOVE_DIST = 50,
      CALIBRATION_PAD_PERC      = 0.25;


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
      appMinX: undefined,
      appMinY: undefined,
      appMaxX: undefined,
      appMaxY: undefined,
      showLeapZone: true,
      leapMinX: 0,
      leapMinY: 0,
      leapMaxX: 1,
      leapMaxY: 1,
      isCalibrating: false,
      calibrationStep: -1,
      calibrationReady: false,
      calibrationRegistering: false,
      winW: window.innerWidth,
      winH: window.innerHeight,
      promptMsg: ''
    }
  }
  initBindings() {

    this.handleKeyDown                  = this.handleKeyDown.bind(this);
    this.handleWindowResize             = this.handleWindowResize.bind(this);
    this.handleControlChange            = this.handleControlChange.bind(this);
    this.handleFullScreenCheckboxChange = this.handleFullScreenCheckboxChange.bind(this);
    this.handleRecalibrateClick         = this.handleRecalibrateClick.bind(this);

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
  initCalibration() { }


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

  handleWindowResize(e) {

    this.setState({
      winW: window.innerWidth,
      winH: window.innerHeight
    });

  }

  handleLeapFrame(e) {

    this.setState({
      hands: e.hands
    });

    if (this.state.isCalibrating) {
      this.updateCalibration();
    }

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

  handleRecalibrateClick(e) {

    this.restartCalibration();

  }

  handleCalibrationTimeout() {

    this.saveCalibrationPt();

    if (this.state.calibrationStep < CALIBRATION_STEPS - 1) {
      this.advanceCalibration();
    } else {
      this.completeCalibration();
    }

  }


  // Methods

  requestFullscreen(el) {
    return el.requestFullscreen || el.msRequestFullscreen || el.mozRequestFullScreen || el.webkitRequestFullscreen;
  }

  getAppAreaRect() {

    const spanLeapX = new Span(this.state.leapMinX, this.state.leapMaxX),
          spanLeapY = new Span(this.state.leapMinY, this.state.leapMaxY),
          winSpanX  = new Span(0, this.state.winW),
          winSpanY  = new Span(0, this.state.winH);

    const x = spanLeapX.mapToSpan(this.state.appMinX, winSpanX),
          y = spanLeapY.mapToSpan(this.state.appMinY, winSpanY),
          r = spanLeapX.mapToSpan(this.state.appMaxX, winSpanX),
          b = spanLeapY.mapToSpan(this.state.appMaxY, winSpanY),
          w = r - x,
          h = b - y;

    return new Rect(x, y, w, h).absolutized();

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
      this.state.winW,
      this.state.winH
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

  getPrompt() {

    if (this.state.isCalibrating) {

        if (this.state.calibrationReady) {
          return `Point at location #${(this.state.calibrationStep + 1)}`;
        } else {
          return 'Move hand away from sensor'
        }

    }

  }

  restartCalibration() {

    const handsOn = (this.state.hands && this.state.hands.length > 0)

    this.setState({
      showLeapZone: false,
      isCalibrating: true,
      calibrationStep: 0,
      calibrationPts: [],
      calibrationReady: !handsOn,
      calibrationRegistering: false
    })

    this.savedPts = [];

    this.updateCalibration();

  }
  resetCalibrationStep() {

    if (this.timeoutCalibration !== undefined) {
      clearTimeout(this.timeoutCalibration);
      this.timeoutCalibration  = undefined;
    }

    this.stepPts  = [];

  }
  updateCalibration() {

    const hands = this.state.hands;

    if (!this.state.calibrationReady) {

      if (!hands.length) {
        this.resetCalibrationStep();
        this.setState({
          calibrationReady: true
        });
      }

    } else {

      if (hands.length > 1) {
        this.setState({
          calibrationReady: false,
          calibrationRegistering: false
        });

      } else if (hands[0]) {

        this.setState({
          calibrationRegistering: true
        })

        if (this.timeoutCalibration === undefined) {
          this.timeoutCalibration = setTimeout(
            this.handleCalibrationTimeout.bind(this),
            CALIBRATION_HOLD_DURATION * 1000
          );
        }

        this.stepPts.push({
          x: hands[0].x,
          y: hands[0].y
        });

        this.checkStepPts();

      } else {
        this.setState({
          calibrationRegistering: false
        });
        this.resetCalibrationStep();

      }

    }

  }
  checkStepPts() {

    let minX, maxX, minY, maxY;

    this.stepPts.forEach((pt, i) => {
      if (minX === undefined || pt.x < minX) minX = pt.x;
      if (maxX === undefined || pt.x > maxX) maxX = pt.x;
      if (minY === undefined || pt.y < minY) minY = pt.y;
      if (maxY === undefined || pt.y > maxY) maxY = pt.y;
    });

    let distX = maxX - minX,
        distY = maxY - minY;

    if (distX > CALIBRATION_MAX_MOVE_DIST || distY > CALIBRATION_MAX_MOVE_DIST) {
      this.resetCalibrationStep();
    }

  }
  advanceCalibration() {

    this.resetCalibrationStep();
    this.setState({
      calibrationStep: this.state.calibrationStep + 1,
      calibrationReady: false,
      calibrationRegistering: false
    });

  }
  completeCalibration() {

    let avgL  = maths.lerp(this.savedPts[0].x, this.savedPts[2].x, 0.5),
        avgR  = maths.lerp(this.savedPts[1].x, this.savedPts[3].x, 0.5),
        avgT  = maths.lerp(this.savedPts[0].y, this.savedPts[1].y, 0.5),
        avgB  = maths.lerp(this.savedPts[2].y, this.savedPts[3].y, 0.5);

    const padW  = (this.state.winW * CALIBRATION_PAD_PERC),
          padH  = (this.state.winH * CALIBRATION_PAD_PERC);

    let areaW = (avgR - avgL) / (1 - (2 * CALIBRATION_PAD_PERC)),
        areaH = (avgB - avgT) / (1 - (2 * CALIBRATION_PAD_PERC)),
        minX  = avgL - (areaW * CALIBRATION_PAD_PERC),
        minY  = avgT - (areaH * CALIBRATION_PAD_PERC),
        maxX  = minX + areaW,
        maxY  = minY + areaH;

    this.setState({
      appMinX: maths.roundTo(minX, 1),
      appMinY: maths.roundTo(minY, 1),
      appMaxX: maths.roundTo(maxX, 1),
      appMaxY: maths.roundTo(maxY, 1),
      calibrationStep: CALIBRATION_STEPS,
      isCalibrating: false,
      showLeapZone: false
    });

  }
  saveCalibrationPt() {

    const count = this.stepPts.length,
          index = this.state.calibrationStep,
          sumX  = this.stepPts.reduce((sum, cur) => (sum + cur.x), 0),
          sumY  = this.stepPts.reduce((sum, cur) => (sum + cur.y), 0);

    this.savedPts[index] = {
      x: sumX / count,
      y: sumY / count
    };

  }


  // React lifecycle

  render() {

    const hasCalibration = this.state.appMinX !== undefined &&
                           this.state.appMinY !== undefined &&
                           this.state.appMaxX !== undefined &&
                           this.state.appMaxY !== undefined;

    const rectApp        = hasCalibration ? this.getAppAreaRect() : undefined,
          hands          = this.getHandsViewData();

    const promptMsg      = this.getPrompt();

    return (

      <div className='app'>

        {(this.state.showLeapZone && hasCalibration) && (
          <div
            className='app-zone'
            style={{
              left:   rectApp.x + 'px',
              top:    rectApp.y + 'px',
              width:  rectApp.w + 'px',
              height: rectApp.h + 'px'
            }}>
            <p>App window area</p>
          </div>
        )}

        {(hands.length > 0) && (
          <HandsDisplay
            hands={hands} />
        )}

        {promptMsg && (
          <div className='prompt'>
              <p>{promptMsg}</p>
          </div>
        )}

        {!this.state.isCalibrating && (
          <ControlsPanel
            fullscreen={this.state.fullscreen}
            showLeapZone={this.state.showLeapZone}
            appMinX={this.state.appMinX}
            appMinY={this.state.appMinY}
            appMaxX={this.state.appMaxX}
            appMaxY={this.state.appMaxY}
            leapMinX={this.state.leapMinX}
            leapMinY={this.state.leapMinY}
            leapMaxX={this.state.leapMaxX}
            leapMaxY={this.state.leapMaxY}
            onControlChange={this.handleControlChange}
            onFullScreenCheckboxChange={this.handleFullScreenCheckboxChange}
            onRecalibrateClick={this.handleRecalibrateClick} />
        )}

        {this.state.isCalibrating && (
          <Calibration
            padPerc={CALIBRATION_PAD_PERC}
            step={this.state.calibrationStep}
            ready={this.state.calibrationReady}
            registering={this.state.calibrationRegistering}
            winW={this.state.winW}
            winH={this.state.winH} />
        )}

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

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('resize', this.handleWindowResize);

  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('resize', this.handleWindowResize);
  }

}
