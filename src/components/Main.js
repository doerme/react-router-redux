require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import NavLink from './NavLink'

//let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {
    return (
        <div>
	        <h1>React Router Tutorial</h1>
	        <ul role="nav">
	            <li><NavLink to="/" onlyActiveOnIndex>Home</NavLink></li>
	            <li><NavLink to="/about">About</NavLink></li>
	            <li><NavLink to="/repos">Repos</NavLink></li>
	        </ul>
	        {this.props.children}
        </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
