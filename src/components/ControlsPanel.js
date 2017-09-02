
// Imports

import * as _ from 'lodash';
import * as $ from 'jquery';
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
            <strong>[L]</strong> Show raw leap data view
          </label>

          <br />

          <label>
            <input
              type='checkbox'
              name='invertX'
              checked={this.props.invertX}
              onChange={this.props.onInvertAxisChange} />
            Invert X
          </label>

          <label>
            <input
              type='checkbox'
              name='invertY'
              checked={this.props.invertY}
              onChange={this.props.onInvertAxisChange} />
            Invert Y
          </label>

        </fieldset>

        <fieldset>
          <legend>App zone</legend>

          <label>
            <input
              type='number'
              name='appMinX'
              value={this.props.appMinX}
              onChange={this.props.onControlChange} />
            x min
          </label>
          <label>
            <input
              type='number'
              name='appMaxX'
              value={this.props.appMaxX}
              onChange={this.props.onControlChange} />
            x max
          </label>
          <br />
          <label>
            <input
              type='number'
              name='appMinY'
              value={this.props.appMinY}
              onChange={this.props.onControlChange} />
            y min
          </label>
          <label>
            <input
              type='number'
              name='appMaxY'
              value={this.props.appMaxY}
              onChange={this.props.onControlChange} />
            y max
          </label>

        </fieldset>

        <fieldset>
          <legend>Leap zone</legend>

          <label>
            <input
              type='text'
              name='leapMinX'
              value={this.props.leapMinX}
              readOnly />
            x min
          </label>
          <label>
            <input
              type='text'
              name='leapMaxX'
              value={this.props.leapMaxX}
              readOnly />
            x max
          </label>
          <br />
          <label>
            <input
              type='text'
              name='leapMinY'
              value={this.props.leapMinY}
              readOnly />
            y min
          </label>
          <label>
            <input
              type='text'
              name='leapMaxY'
              value={this.props.leapMaxY}
              readOnly />
            y max
          </label>

        </fieldset>

      </div>

    );

  }

}
