import 'core-js/fn/object/assign';
import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

import * as reducers from './reducers';
import { App, About, Repos, Repo, Home } from './components';

const reducer = combineReducers({
	...reducers,
	routing: routerReducer
})

const store = createStore(
	reducer
)

render(
	<Provider store={store}>	
		<Router history={browserHistory}>
			<Route path="/" component={App}>
				<IndexRoute component={Home}/>
				<Route path="/repos" component={Repos}>
					<Route path="/repos/:userName/:repoName" component={Repo}/>
				</Route>
				<Route path="/about" component={About}/>
			</Route>
		</Router>
	</Provider>
, document.getElementById('app'))