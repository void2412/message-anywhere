import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {ADD_MESSAGE, REMOVE_MESSAGE, EDIT_MESSAGE } from '../utils/mutations';
import { QUERY_MESSAGES, QUERY_ME } from '../utils/queries';
import Form from 'react-bootstrap/Form'
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
	const {loading: meLoading, error: meError, data: meData} = useQuery(QUERY_ME)

	if(meLoading){
		return (<>Loading User Data ...</>)
	}
	console.log(messageData)
	const userId = meData?.me._id || null
	const handleClick = (e)=>{

	}

	

	return (<Form>
		<div className="form-control mb-3">
			{messageLoading ?
			(<>Loading Messages</>)
			:
			(<div>
			{messageData.messages.map((message)=>{
				const id = message.user._id
				const text = message.text
				if (id === userId){
					return (<div key={id} data-id={id} className="text-end">{text}</div>)
				}
				else{
					return(<div key={id} data-id={id} className="text-start">{text}</div>)
				}
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