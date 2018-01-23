
// Imports

import * as _ from 'lodash';
import * as React from 'react';
import * as Leap from 'leapjs';

import { maths } from 'varyd-utils';


// Constants


// Class

export default class ControlsPanel extends React.Component {

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

  getAppAreaJSON() {

    return `"calibration": {\n` +
    `  "xMin": ${this.props.appMinX},\n` +
    `  "xMax": ${this.props.appMaxX},\n` +
    `  "yMin": ${this.props.appMinY},\n` +
    `  "yMax": ${this.props.appMaxY},\n` +
    `  "zMin": -1,\n` +
    `  "zMax": -1\n` +
    `}\n`;

  }


  // React

  render() {

      const hasCalibration = this.props.appMinX !== undefined &&
                             this.props.appMinY !== undefined &&
                             this.props.appMaxX !== undefined &&
                             this.props.appMaxY !== undefined;

    return (

      <div className='controls'>

        <fieldset>
          <legend>View</legend>

          <label>
            <input
              type='checkbox'
              checked={this.props.fullscreen}
              onChange={this.props.onFullScreenCheckboxChange} />
            <strong>[F]</strong> Fullscreen
          </label>

          <br />

          <label>
            <input
              type='checkbox'
              name='showHeatmap'
              checked={this.props.showHeatmap}
              onChange={this.props.onControlChange} />
            <strong>[H]</strong> Show confidence heat map
          </label>

        </fieldset>

        <fieldset>
          <legend>App zone</legend>

          {hasCalibration && (
            <p className='area'>
              <input
                className='area-top'
                type='number'
                name='appMinY'
                value={this.props.appMinY}
                onChange={this.props.onControlChange} />
              <input
                className='area-left'
                type='number'
                name='appMinX'
                value={this.props.appMinX}
                onChange={this.props.onControlChange} />
              <input
                className='area-right'
                type='number'
                name='appMaxX'
                value={this.props.appMaxX}
                onChange={this.props.onControlChange} />
              <input
                className='area-btm'
                type='number'
                name='appMaxY'
                value={this.props.appMaxY}
                onChange={this.props.onControlChange} />
            </p>
          )}

          <p>
            <button
              className='recalibrate'
              onClick={this.props.onRecalibrateClick}>
              Recalibrate
            </button>
          </p>

          {hasCalibration && (
            <p>
              <textarea
                className='raw-json'
                readOnly
                value={this.getAppAreaJSON()} />
            </p>
          )}

        </fieldset>

      </div>

    );

  }

}
