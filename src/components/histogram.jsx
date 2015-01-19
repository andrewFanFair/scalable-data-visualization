'use strict';

// external deps
var React = require('react');
var d3 = require('d3');

// internal deps
var Bars = require('./bars.jsx');

// utility functions
function regularArray(typedArray) {
  var arr = new Array(typedArray.length);
  for (var i=0; i<typedArray.length; i++) {
    arr[i] = typedArray[i];
  }
  return arr;
}

module.exports = React.createClass({
  /* component functions */
  zoom: function(amt) {
    this.setState({ bucketOffset: this.state.bucketOffset + amt });
  },
  /* event handlers */
  preventDefault: function(evt) {
    // used on component to prevent text selection via double-click
    evt.preventDefault();
  },
  zoomIn: function(evt) {
    evt.stopPropagation();
    this.zoom(1);
  },
  zoomOut: function(evt) {
    evt.stopPropagation();
    this.zoom(-1);
  },
  /* react lifecycle methods */
  getInitialState: function() {
    return { bucketOffset: 0 };
  },
  render: function() {
    // TODO -- figure out how to cleanly map over typed arrays
    // without having to copy to a regular array
    var data = this.props.data.formatHistogram(this.props.name, this.state.bucketOffset);
    var values = regularArray(data.values);

    var width = 630;
    var height = Math.floor(width/2);
    var xScale = d3.scale.linear()
      .domain([0, values.length])
      .range([0, width]);
    var yScale = d3.scale.linear()
      .domain([d3.min(values), data.maxValue])
      .range([0, height]);
    return (
      <div className="histogram" onMouseDown={this.preventDefault}>
        <div className="zoomControls">
          Viewing at 10^{data.bucket} scale.
          {this.state.bucketOffset === 0 ? null : (
            <a
              className="btn btn-default"
              onClick={this.zoomOut}
            >
              Zoom Out
            </a>
          )}
        </div>
        <svg
          width={width + 100}
          height={height + 100}
        >
          <Bars
            values={values}
            bucket={data.bucket}
            width={width}
            height={height}
            scales={{
              x: xScale,
              y: yScale
            }}
            zoomIn={this.zoomIn}
          />
        </svg>
      </div>
    );
  }
});