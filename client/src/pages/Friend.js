import React, {useState} from 'react'
import {useMutation, useQuery} from '@apollo/client'
import {QUERY_ME} from '../utils/queries'
import {ADD_CONTACT, REMOVE_CONTACT, ADD_CONVERSATION} from '../utils/mutations'
import { useNavigate } from "react-router-dom";
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
	let navigate = useNavigate()
	const {loading, error, data} = useQuery(QUERY_ME)
	const [removeContact] = useMutation(REMOVE_CONTACT)
	const [addContact] = useMutation(ADD_CONTACT)
	const userData= data?.me||{}
	const [addConversation] = useMutation(ADD_CONVERSATION)

	const handleAddContact = async (e)=>{
		const target = e.target
		const elementList = e.currentTarget.childNodes
		if(target.type =='button'){
			const currentContact = elementList[0].value
			try{
				const {data} = await addContact({
					variables: {email: currentContact}
				})
				window.location.reload()
			}
			catch(e){
				console.error(e)
			}

		}
		
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


	const handleAddConversation = async (e)=>{
		try{
			let members = [e.target.getAttribute('data-email')]
			const {data} = await addConversation({variables:{members: members}})
			localStorage.setItem('currentConversation',data.addConversation._id)
			navigate("/messages")
		}
		catch(e){
			console.error(e)
		}
	}

	return (
		<Container>
			<form>
				<InputGroup className="mb-2" onClick={handleAddContact}>
				<Form.Control placeholder='user email' />
				<Button variant="primary">Add Contact</Button>
				</InputGroup>
			</form>
			{loading ? 
			(<div>Loading...</div>)
			:
			(<Row>
				{userData.contacts?.map((contact, index)=>{
					return (
						<Col key={index} sm={12} md={6} lg={4}>
							<Card className='mb-2 text-center'>
								<Card.Body>
									<Card.Title>{contact.name}</Card.Title>
									<Card.Text>{contact.email}</Card.Text>
									<Button variants="primary" className='me-2' data-email={contact.email} onClick={handleAddConversation}>Start Chat</Button>
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