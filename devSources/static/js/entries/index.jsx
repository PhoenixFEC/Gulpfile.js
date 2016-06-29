import 'babel-polyfill';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
// import { Router, Route, Link, browserHistory } from 'react-router';

// Components
import HomeRoot from '../components/R_Layout/home.jsx';



function render() {
  ReactDOM.render(
    <AppContainer>
      <HomeRoot />
    </AppContainer>,
    document.getElementById('RD')
  );
}

if (module.hot) {
  module.hot.accept([
    '../components/R_Layout/home.jsx'
  ], () => {
    render(
      require('../components/R_Layout/home.jsx').default
    );
  });
}

render();