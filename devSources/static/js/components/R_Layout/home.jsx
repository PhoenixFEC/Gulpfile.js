import 'babel-polyfill';

import React, { Component } from 'react';
import { AppContainer } from 'react-hot-loader';
// import { Router, Route, Link, browserHistory } from 'react-router';






export default class HomeRoot extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        Hi~~You did!
      </div>
    );
  }
}