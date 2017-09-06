
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

    return '{\n' +
      `  xMin: ${this.props.appMinX},\n` +
      `  xMax: ${this.props.appMaxX},\n` +
      `  yMin: ${this.props.appMinY},\n` +
      `  yMax: ${this.props.appMaxY}\n` +
      '}\n';

  }


  // React lifecycle

  render() {

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
              name='showLeapZone'
              checked={this.props.showLeapZone}
              onChange={this.props.onControlChange} />
            <strong>[L]</strong> Show full leap area
          </label>

        </fieldset>

        <fieldset>
          <legend>App zone</legend>

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

          <p>
            <button
              className='recalibrate'
              onClick={this.props.onRecalibrateClick}>
              Recalibrate
            </button>
          </p>

          <p>
            <textarea
              className='raw-json'
              readOnly
              value={this.getAppAreaJSON()} />
          </p>

          </fieldset>

        <fieldset>
          <legend>Leap zone</legend>

          <label>
            <input
              type='checkbox'
              name='invertX'
              checked={this.props.invertX}
              onChange={this.props.onInvertAxisChange} />
            <strong>[X]</strong> Invert X
          </label>

          <label>
            <input
              type='checkbox'
              name='invertY'
              checked={this.props.invertY}
              onChange={this.props.onInvertAxisChange} />
            <strong>[Y]</strong> Invert Y
          </label>

          <p className='area'>

            <input
              className='area-top'
              type='text'
              name='leapMinY'
              value={this.props.leapMinY}
              readOnly />
            <input
              className='area-left'
              type='text'
              name='leapMinX'
              value={this.props.leapMinX}
              readOnly />
            <input
              className='area-right'
              type='text'
              name='leapMaxX'
              value={this.props.leapMaxX}
              readOnly />
            <input
              className='area-btm'
              type='text'
              name='leapMaxY'
              value={this.props.leapMaxY}
              readOnly />
          </p>

        </fieldset>

      </div>

    );

  }

}
