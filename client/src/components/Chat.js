import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {ADD_MESSAGE, REMOVE_MESSAGE, EDIT_MESSAGE } from '../utils/mutations';
import { QUERY_MESSAGES, QUERY_ME } from '../utils/queries';
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup'

import Auth from '../utils/auth'

const Chat = (props)=> {
	const token = Auth.getToken()||false
	if(!token || Auth.isTokenExpired(token)){
		window.location.assign('/login')
	}

	const {loading: messageLoading, error: messageError, data: messageData} = useQuery(QUERY_MESSAGES,{
		variables: {conversationId: props.conversationId}
	})

	const handleClick = (e)=>{

	}

	

	return (<Form>
		<div className="form-control mb-3">
			{messageLoading ?
			(<>Loading Messages</>)
			:
			(<div>
			{messageData.map((message)=>{
				
			})}
			</div>)}
		</div>
		<InputGroup onClick={handleClick}>
				<Form.Control as='textarea' placeholder='Your message goes here'/>
				<Button variant='primary'>Send</Button>
		</InputGroup>
		
	</Form>)
}

export default Chat