
// Imports

import * as _ from 'lodash';
import * as $ from 'jquery';
import * as React from 'react';
import * as Leap from 'leapjs';

import { maths } from 'varyd-utils';
import LeapAgent from './LeapAgent';
import ControlsPanel from './ControlsPanel';
import HandsDisplay from './HandsDisplay';


// Constants


// Class

export default class App extends React.Component {

  // Constructor

  constructor() {

    super();

    this.initState();
    this.initBindings();
    this.initLeap();
  }

  initState() {

    this.state = {
      invertX: false,
      invertY: true,
      invertZ: true
    }
  }

  initBindings() {

    this.handleControlChange  = this.handleControlChange.bind(this);

  }

  initLeap() {

    this.leap = new LeapAgent();
    this.leap.addListener('leapFrame', this.handleLeapFrame.bind(this));

  }


  // Event handlers

  handleLeapFrame(e) {

    this.setState({
      hands: e.hands
    })

  }

  handleControlChange(e) {

    const target = e.target,
          value  = (target.type === 'checkbox') ? target.checked : target.value,
          name   = target.name;

    this.setState({
      [name]: value
    });

  }

  // Methods

  // React lifecycle

  render() {

    const hasHands  = (this.state.hands !== undefined) && (this.state.hands.length > 0);

    return (

      <div className='app'>

        <ControlsPanel
          invertX={this.state.invertX}
          invertY={this.state.invertY}
          invertZ={this.state.invertZ}
          onControlChange={this.handleControlChange} />

        {hasHands && (
          <HandsDisplay
            invertX={this.state.invertX}
            invertY={this.state.invertY}
            invertZ={this.state.invertZ}
            hands={this.state.hands} />
        )}

      </div>

    );

  }

  componentDidMount() {

    this.$doc   = $(document);
    this.$win   = $(window);
    this.$body  = $('body');

  }


}
