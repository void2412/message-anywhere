import React, {useState} from 'react'
import {useMutation, useQuery} from '@apollo/client'
import {QUERY_ME} from '../utils/queries'
import {ADD_CONTACT, REMOVE_CONTACT} from '../utils/mutations'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Auth from '../utils/auth';
const Friend = () => {
	const token = Auth.getToken()||false
	if(!token||Auth.isTokenExpired(token)){
		window.location.assign('/')
	}

	const {loading, error, data} = useQuery(QUERY_ME)
	const [removeContact] = useMutation(REMOVE_CONTACT)
	const [addContact] = useMutation(ADD_CONTACT)
	const userData= data?.me||{}
	const[currentContact, setCurrentContact] = useState('')

	const handleInputChange = (e)=>{
		setCurrentContact(e.target.value)
	}

	const handleAddContact = async ()=>{	
		try{
			const {data} = await addContact({
				variables: {email: currentContact}
			})
			window.location.reload()
		}
		catch(e){
			console.error(e)
		}

		setCurrentContact('')
	}

	const handleRemoveContact = async (e)=>{
		try{
			const {data} = await removeContact({
				variables: {userId: e.target.getAttribute('data-id')}
			})
			window.location.reload()
		}
		catch(e){
			console.error(e)
		}
	}

	return (
		<Container>
			<form>
				<InputGroup className="mb-2">
				<Form.Control onChange={handleInputChange} placeholder='user email' />
				<Button variant="primary" onClick={handleAddContact}>Add Contact</Button>
				</InputGroup>
			</form>
			{loading ? 
			(<div>Loading...</div>)
			:
			(<Row>
				{userData.contacts.map((contact, index)=>{
					return (
						<Col key={index} sm={12} md={6} lg={4}>
							<Card className='mb-2'>
								<Card.Body>
									<Card.Title>{contact.name}</Card.Title>
									<Card.Text>{contact.email}</Card.Text>
									<Button variants="primary" className='me-2'>Start Chat</Button>
									<Button variants="danger" onClick={handleRemoveContact} data-id={contact._id}>Remove Friend</Button>
								</Card.Body>
							</Card>
						</Col>
					)
				})}
			</Row>)
			}
			
		</Container>
	)
}

export default Friend