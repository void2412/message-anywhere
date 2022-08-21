import React from 'react';
import { Link } from 'react-router-dom';
import {Navbar, Nav, Container} from 'react-bootstrap'

import Auth from '../utils/auth'

const AppNavbar = ()=>{
	console.log(Auth.loggedIn)
	return (
		<>
			<Navbar bg='dark' variant = 'dark' expand='lg' className='mb-3'>
				<Container fluid>
					<Navbar.Brand as={Link} to='/'>
						Message Anywhere
					</Navbar.Brand>

					<Navbar.Toggle aria-controls='navbar'/>
					<Navbar.Collapse id='navbar'>
						<Nav className='ml-auto'>
							{Auth.loggedIn() ? (
							<>
								<Nav.Link as={Link} to='/messages'>Your Conversation</Nav.Link>
								<Nav.Link as={Link} to='/friends'>Your Contacts</Nav.Link>
								<Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
							</>)
							: 
							(<>
								<Nav.Link as={Link} to='/login'>Login</Nav.Link>
								<Nav.Link as={Link} to='/signup'>Signup</Nav.Link>
							</>)}
						</Nav>
						
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</>
	)
}

export default AppNavbar