
// Imports
/////////////////////////////////////////////

import * as _ from 'lodash';
import * as $ from 'jquery';
import * as React from 'react';
import * as Leap from 'leapjs';


// Constants
/////////////////////////////////////////////

const MIN_X    = -250,
  MAX_X      = 250,
  MIN_Y      = 450,
  MAX_Y      = 150;

const GRID_COLS      = 16,
  GRID_ROWS      = 9;


// Class
/////////////////////////////////////////////

export default class App extends React.Component {

  // React lifecycle
  /////////////////////////////////////////////

  constructor() {

    super();

    Leap.loop({
      enableGestures: true
    }, (f) => {
      this._handleLeapFrame(f)
    });

    this.state  = {
      count: 0
    };

  }

  render() {

    return (

      <div>

        <table id='grid'>
          <tbody>
            {_.times(GRID_ROWS, (row) =>
              <tr key={row}>
                {_.times(GRID_COLS, (col) =>
                  <td key={col} data-col={col} data-row={row}></td>
                )}
              </tr>
            )}
          </tbody>
        </table>

        {_.times(2, (i) =>
          <div key={i} className='hand'>
            <div className='palm'></div>
            {_.times(5, (j) =>
              <div key={j} className='finger'></div>
            )}
          </div>
        )}

      </div>

    );

  }

  componentDidMount() {

    this.$body  = $('body');
    this.$grid  = this.$body.find('table#grid');
    this.$cells  = this.$grid.find('td');

    requestAnimationFrame((timestamp) => {
      this._handleFrame(timestamp);
    });

  }


  // Event handlers
  /////////////////////////////////////////////

  _handleFrame(timestamp) {

    this.setState({
      count: (this.state.count + 1)
    });

    requestAnimationFrame((timestamp) => {
      this._handleFrame(timestamp)
    });

  }

  _handleLeapFrame(frame) {

    this._updateHands(frame.hands);
    this._updateGrid(frame.hands);

  }


  // Methods
  /////////////////////////////////////////////

  _updateHands(hands) {

    const $hands      = this.$body.find('div.hand');

    $hands.each((i, elHand) => {

      let $hand    = $(elHand),
        $palm    = $hand.children('.palm'),
        $fingers  = $hand.children('.finger');

      let hand    = hands[i];

      if (hand) {

        $hand.show();

        let palmPos    = hand.palmPosition,
          palmLeft  = this._map(palmPos[0], MIN_X, MAX_X, 0, this.$grid.width()),
          palmTop    = this._map(palmPos[1], MIN_Y, MAX_Y, 0, this.$grid.height());

        $palm.css({
          'left': palmLeft,
          'top':  palmTop
        });

        $fingers.each((j, elFinger) => {

          let finger    = hand.fingers[j];

          if (finger) {

            let $finger    = $(elFinger),
              fingerPos  = hand.fingers[j].distal.nextJoint;

            $finger.css({
              'left': this._map(fingerPos[0], MIN_X, MAX_X, 0, this.$grid.width()),
              'top': this._map(fingerPos[1], MIN_Y, MAX_Y, 0, this.$grid.height())
            });

          }

        });

      } else {
        $hand.hide();

      }

    });

  }

  _updateGrid(hands) {

    const litCells  = hands.map((hand, i) => {
      return {
        col: Math.floor(this._map(hand.palmPosition[0], MIN_X, MAX_X, 0, GRID_COLS)),
        row: Math.floor(this._map(hand.palmPosition[1], MIN_Y, MAX_Y, 0, GRID_ROWS))
      };
    });

    this.$cells.each((i, elCell) => {

      var $cell  = $(elCell),
        isLit  = false;

      for (var i = 0; i < litCells.length; i++) {
        if ($cell.data('col') == litCells[i].col && $cell.data('row') == litCells[i].row) {
          isLit  = true;
          break;
        }
      }

      $cell.toggleClass('lit', isLit);

    });


  }


  // Helpers
  /////////////////////////////////////////////

  _norm(val, min, max) {
    return (val - min) / (max - min);
  }

  _map(val, min, max, tMin, tMax) {
    return this._lerp(tMin, tMax, this._norm(val, min, max));
  }

  _lerp(min, max, val) {
    if (val === undefined) val = 0.5;
    return (min * (1 - val)) + (max * val);
  }

}
