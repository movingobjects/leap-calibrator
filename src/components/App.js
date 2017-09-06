
// Imports

import * as _ from 'lodash';
import * as React from 'react';
import * as Leap from 'leapjs';

import screenfull from 'screenfull';

import { maths, Rect } from 'varyd-utils';
import LeapAgent from '../utils/LeapAgent';

import ControlsPanel from './ControlsPanel';
import HandsDisplay from './HandsDisplay';
import AppArea from './AppArea';
import Prompts from './Prompts';
import Calibration from './Calibration';


// Constants

const DEF_APP_MIN_X             = -300,
      DEF_APP_MIN_Y             = 430,
      DEF_APP_MAX_X             = 250,
      DEF_APP_MAX_Y             = 135;

const MODE_INIT                 = 'MODE_INIT',
      MODE_CALIBRATING          = 'MODE_CALIBRATING',
      MODE_CALIBRATION_COMPLETE = 'MODE_CALIBRATION_COMPLETE';

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
      mode: MODE_INIT,
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
      calibrationStep: -1,
      calibrationReady: false,
      calibrationRegistering: false,
      winW: window.innerWidth,
      winH: window.innerHeight
    }
  }
  initBindings() {

    this.handleKeyDown                  = this.handleKeyDown.bind(this);
    this.handleWindowResize             = this.handleWindowResize.bind(this);
    this.handleControlChange            = this.handleControlChange.bind(this);
    this.handleFullScreenCheckboxChange = this.handleFullScreenCheckboxChange.bind(this);
    this.handleInvertAxisChange         = this.handleInvertAxisChange.bind(this);
    this.handlePromptBtnClick                 = this.handlePromptBtnClick.bind(this);

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

  // Getters & setters


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

    console.log(this.state.winW);

  }

  handleLeapFrame(e) {

    if (this.state.mode == MODE_CALIBRATING) {
      this.updateCalibration(e.hands);
    }

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

  handlePromptBtnClick(e) {

    switch (this.state.mode) {

      case MODE_INIT:
      case MODE_CALIBRATING:
        this.restartCalibration();
        break;

      case MODE_CALIBRATION_COMPLETE:
        this.setState({
          mode: MODE_INIT
        });
        break;

    }

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

    const showLeapZone  = this.state.showLeapZone,
          winW          = this.state.winW,
          winH          = this.state.winH;

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

  getPrompts() {

    let msg = '',
        btnLabel = '';

    switch (this.state.mode) {

      case MODE_INIT:
        msg = 'Leap Sensor Calibration';
        btnLabel  = 'Start Calibration';
        break;

      case MODE_CALIBRATING:

        if (this.state.calibrationReady) {
          msg = `Point at location #${(this.state.calibrationStep + 1)}`;
        } else {
          msg = 'Move hand away from sensor'
        }

        if (this.state.calibrationStep != 0) {
          btnLabel  = 'Restart';
        }

        break;

      case MODE_CALIBRATION_COMPLETE:
        msg = 'Calibration Complete';
        btnLabel  = 'Cool';
        break;

    }

    return (
      <Prompts
        message={msg}
        btnLabel={btnLabel}
        onBtnClick={this.handlePromptBtnClick} />
    );

  }

  restartCalibration() {

    const handsOn = (this.state.hands && this.state.hands.length)

    this.setState({
      mode: MODE_CALIBRATING,
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
  updateCalibration(hands = []) {

    if (!this.state.calibrationReady) {
      if (!hands.length) {
        this.resetCalibrationStep();
        this.setState({
          calibrationReady: true
        });
      }

    } else if (hands.length > 1) {
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
      appMinX: maths.roundTo(minX, 2),
      appMinY: maths.roundTo(minY, 2),
      appMaxX: maths.roundTo(maxX, 2),
      appMaxY: maths.roundTo(maxY, 2),
      calibrationStep: CALIBRATION_STEPS,
      mode: MODE_CALIBRATION_COMPLETE
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

        {this.getPrompts()}

        {(this.state.mode != MODE_CALIBRATING) && (
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
        )}

        {(this.state.mode == MODE_CALIBRATING) && (
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
