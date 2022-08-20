import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import NavbarComponent from './components/Navbar'

const httpLink = createHttpLink({
	uri:'/graphql'
})

const authLink = setContext((_, {headers})=>{
	const token = localStorage.getItem('auth_token')
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : ''
		}
	}
})

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache()
})

function App() {
  return (
	<ApolloProvider client={client}>
		<Router>
			<>
				<NavbarComponent />
			</>
		</Router>
	</ApolloProvider>
  );
}

export default App;
