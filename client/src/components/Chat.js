import React, {useEffect} from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import {ADD_MESSAGE, REMOVE_MESSAGE, EDIT_MESSAGE } from '../utils/mutations';
import {MESSAGES_SUBSCRIPTION} from '../utils/subscriptions'
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

	
	


	const {loading: messageLoading, error: messageError, data: messageData} = useSubscription(MESSAGES_SUBSCRIPTION,{
		variables: {conversationId: props.conversationId}
	})
	const {loading: meLoading, error: meError, data: meData} = useQuery(QUERY_ME)
	const [addMessage] = useMutation(ADD_MESSAGE)

	useEffect(()=>{
		if(!messageLoading){
			document.querySelector('#chatArea').scrollTop = document.querySelector('#chatArea').scrollHeight
		}
		
	})

	if(meLoading){
		return (<>Loading User Data ...</>)
	}
	const userId = meData?.me._id || null

	


	const handleClick = async (e)=>{
		e.preventDefault()
		const input= document.querySelector('#inputMessage')
		const currentTextMessage = input.value.trim()
		if (currentTextMessage != ''){
			try{
				const {data} = await addMessage({
					variables: {
						conversationId: props.conversationId,
						text: currentTextMessage
					}
				})
				
				
			}
			catch(err){
				console.error(err)
			}
			finally{
				input.value = ''
				document.querySelector('#chatArea').scrollTop = document.querySelector('#chatArea').scrollHeight
			}
		}
	}

	const renderChatMessages = () =>{
		if(messageLoading){
			return (<div>Loading Messages</div>)
		}
		else{
			return (<>
				{messageData.messages.map((message)=>{
					const id = message.user._id
					const text = message.text
					if (id === userId){
						return (<div key={message._id} data-id={message._id} className="mb-2" style={{
							display: 'flex',
							alignItems: 'end',
							justifyContent: "end",
						}}>
							<div className="p-3" style={{
								background: "#58bf56",
								borderRadius: "15px",
								maxWidth: "60%"
							}}>
								{text}
							</div>
						</div>)
					}
					else{
						return(<div key={message._id} data-id={message._id} className="mb-2" style={{
							display: 'flex',
							justifyContent: "start"
						}}>
							<div className="p-3" style={{
								background: "#e5e6ea",
								borderRadius: "15px",
								maxWidth: "60%"
							}}>
								{text}
							</div>						
						</div>)
					}
				})}
				</>)
		}
	}
	



	return (
	<>
		<div className="form-control mb-3" id="chatArea" style={{
			height: "700px",
			overflowY: "auto"
		}}>
			{renderChatMessages()}
		</div>
		<Form>
		<InputGroup>
				<Form.Control as='textarea' id='inputMessage' placeholder='Your message goes here' />
				<Button id='submit' variant='primary' onClick={handleClick}>Send</Button>
		</InputGroup>
		
		</Form>
	</>
	)
}

export default Chat