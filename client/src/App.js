import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Container from 'react-bootstrap/Container';

import Homepage from './pages/Homepage'
import Friend from './pages/Friend'
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound'
import Message from './pages/Message'
import NavbarComponent from './components/Navbar'

import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';


const httpLink = createHttpLink({
	uri:'/graphql'
})

const wsLink = new GraphQLWsLink(createClient({
	url: `wss://localhost:${process.env.PORT}/subscriptions`
  }));

const authLink = setContext((_, {headers})=>{
	const token = localStorage.getItem('id_token')
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : ''
		}
	}
})

const splitLink = split(
	({ query }) => {
	  const definition = getMainDefinition(query);
	  return (
		definition.kind === 'OperationDefinition' &&
		definition.operation === 'subscription'
	  );
	},
	wsLink,
	authLink.concat(httpLink),
  );

const client = new ApolloClient({
	link: splitLink,
	cache: new InMemoryCache()
})

function App() {
  return (
	<ApolloProvider client={client}>
		<Router>
			<NavbarComponent />
			<Container>
				<Routes>
					<Route path='/' element={<Homepage />}/>
					<Route path='/messages' element={<Message/>}/>
					<Route path='/friends' element={<Friend />}/>
					<Route path='/login' element ={<Login/>}/>
					<Route path="/signup" element={<Signup/>}/>
					<Route path="*"element={<NotFound />}/>
				</Routes>
			</Container>
		</Router>
	</ApolloProvider>
  );
}

export default App;
