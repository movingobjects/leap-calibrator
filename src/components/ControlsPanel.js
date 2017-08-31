
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
        <h2>Controls</h2>

        <label>
          <input
            type='checkbox'
            name='invertX'
            checked={this.props.invertX}
            onChange={this.props.onControlChange} />
          Invert X
        </label>
        <br />

        <label>
          <input
            type='checkbox'
            name='invertY'
            checked={this.props.invertY}
            onChange={this.props.onControlChange} />
          Invert Y
        </label>
        <br />

        <label>
          <input
            type='checkbox'
            name='invertZ'
            checked={this.props.invertZ}
            onChange={this.props.onControlChange} />
          Invert Z
        </label>
      </div>

    );

  }


}
