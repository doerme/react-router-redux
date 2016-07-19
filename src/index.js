import 'core-js/fn/object/assign';
import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import {}  from './sdk';

import * as reducers from './reducers';
import { App, About, Repos, Repo, Home } from './components';

const store = createStore(
	combineReducers({
		...reducers,
		routing: routerReducer
	})
)

const history = syncHistoryWithStore(hashHistory, store);

window.env.init({
	url :{
		find4IndexPage : '/web/replay/find4IndexPage',
		findReplayByType : '/web/replay/findReplayByType',
		watchRecommendPopularReplay : '/web/replay/watchRecommendPopularReplay',
		watchPopularReplay : '/web/replay/watchPopularReplay'
	}
});



window.sdk.init(() => {
    window.sdk.getUser((user) => {
        window.sdk.user = {
            uid: user.uid,
        }
		render(
			<Provider store={store}>	
				<Router history={history}>
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
    })
})