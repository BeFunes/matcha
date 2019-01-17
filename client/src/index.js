import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from 'react-router-dom';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import theme from './theme';
import {WebSocketLink} from 'apollo-link-ws'
import {SubscriptionClient} from "subscriptions-transport-ws";
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloProvider} from 'react-apollo';
import {ApolloClient} from 'apollo-client';
import {HOST} from "./constants";
import { ApolloLink , concat} from 'apollo-link';

const GRAPHQL_ENDPOINT = `ws://${HOST}:3002/graphql`;

const wsClient = new SubscriptionClient(GRAPHQL_ENDPOINT, {
	reconnect: true,
	connectionParams: {
		authToken: localStorage.getItem('token')
	}
})

const authMiddleware = new ApolloLink((operation, forward) => {
	const token = localStorage.getItem('token')
	operation.setContext({
		headers: {
			authorization: token ? `Bearer ${token}` : null
		}
	})
	return forward(operation)
})

const link = new WebSocketLink(wsClient)

const client = new ApolloClient({
	link: concat(authMiddleware, link),
	cache: new InMemoryCache()
})

const app = (
	<BrowserRouter>
		<MuiThemeProvider theme={theme}>
			<ApolloProvider client={client}>
				<App />
			</ApolloProvider>
		</MuiThemeProvider>
	</BrowserRouter>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
