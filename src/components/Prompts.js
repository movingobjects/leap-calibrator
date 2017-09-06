
// Imports

import * as _ from 'lodash';
import * as React from 'react';
import * as Leap from 'leapjs';

import { maths } from 'varyd-utils';


// Constants


// Class

export default class Prompts extends React.Component {

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

    const hasMsg  = (this.props.message && this.props.message.length),
          hasBtn  = (this.props.btnLabel && this.props.btnLabel.length) && (this.props.onBtnClick);

    return (

      <div className="prompts">

        {hasMsg && (
          <p>{this.props.message}</p>
        )}

        {hasBtn && (
          <p>
            <button
              onClick={this.props.onBtnClick}>
              {this.props.btnLabel}
            </button>
          </p>
        )}

      </div>

    );

  }


}
