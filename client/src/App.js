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
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound'
// import Message from './pages/Message'
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
			<NavbarComponent />
			<Container>
				<Routes>
					<Route path='/' element={<Homepage />}/>
					{/* <Route path='/messages' element={<Message/>}/> */}
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
