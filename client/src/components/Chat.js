import React, {useEffect} from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import {ADD_MESSAGE, REMOVE_MESSAGE, EDIT_MESSAGE } from '../utils/mutations';
import {MESSAGES_SUBSCRIPTION} from '../utils/subscriptions'
import { QUERY_MESSAGES, QUERY_ME } from '../utils/queries';
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown';
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
	const [removeMessage] = useMutation(REMOVE_MESSAGE)
	const [editMessage]= useMutation(EDIT_MESSAGE)
	useEffect(()=>{
		if(!messageLoading){
			document.querySelector('#chatArea').scrollTop = document.querySelector('#chatArea').scrollHeight
		}
		
	})

	if(meLoading){
		return (<>Loading User Data ...</>)
	}
	const userId = meData?.me._id || null

	


	const handleClick = (e)=>{
		e.preventDefault()
		handleSendMsg()
	}

	const handleSendMsg = async () => {
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

	const styles = {
		hidden:{display: "none"},
		show:{display:"block"}
	}

	const showButtons = (event) => {
		let parent = event.currentTarget
		parent.childNodes[0].style.display = "block"
		parent.childNodes[1].style.display = "block"
	}

	const hideButtons = (event) => {
		let parent = event.currentTarget
		parent.childNodes[0].style.display = "none"
		parent.childNodes[1].style.display = "none"
	}

	const removeMessageClick=(e) =>{
		const messageId = e.target.parentNode.getAttribute('data-id')
		try{
			removeMessage({
				variables:{messageId: messageId}
			})
		}
		catch (err) {
			console.error(err)
		}
	}

	const editMessageClick=(e)=>{
		let parent = e.target.parentNode

		parent.childNodes[2].style.display = "block"
		parent.childNodes[3].style.display = "block"
		parent.childNodes[4].style.display = "block"
	}

	const hideAll=(e)=>{
		let parent = e.target.parentNode
		parent.childNodes[2].style.display = "none"
		parent.childNodes[3].style.display = "none"
		parent.childNodes[4].style.display = "none"
		
	}

	const saveData= async (e)=>{
		console.log(e.target)
		let parent = e.target.parentNode
		console.log(parent)
		let messageId = parent.getAttribute('data-id')
		let text = parent.childNodes[2].value.trim()||''
		if(text!==''){
			try{
				await editMessage({
					variables:{
						messageId: messageId,
						text: text
					}
				})
				hideAll(e)
			}
			catch (e) {
				console.log(e)
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
						return (<div onMouseEnter={showButtons} onMouseLeave={hideButtons} key={message._id} data-id={message._id} className="mb-2" style={{
							display: 'flex',
							alignItems: 'end',
							justifyContent: "end"
						}}>
								<Button variant="danger" style={styles.hidden} onClick={removeMessageClick} className="extraBtn">Remove</Button>
								<Button variant="light" style={styles.hidden} onClick={editMessageClick} className = "extraBtn">Edit</Button>
								<Form.Control as="input" style={styles.hidden}/>
								<Button variant="secondary" style={styles.hidden} onClick={hideAll}>Cancel</Button>
								<Button variant = "primary" style={styles.hidden} onClick={saveData}>Save</Button>
								<Button className="p-3 btn btn-success" style={{
									background: "#58bf56",
									borderRadius: "15px",
									maxWidth: "60%",
									border: "none"
								}}>
									{text}
								</Button>
								
						</div>)
					}
					else{
						return(<div key={message._id} data-id={message._id} className="mb-2" style={{
							display: 'flex',
							alignItems: 'start',
							justifyContent: "start"
						}}>
							
							<Button className="p-3 btn btn-secondary"  style={{
								background: "#e5e6ea",
								borderRadius: "15px",
								maxWidth: "60%",
								color:'black',
								border: "none"
							}}>
								{text}
							</Button>
										
						</div>)
					}
				})}
				</>)
		}
	}
	

	const handleKey = (key)=>{
		if(key.keyCode == 13 && !key.shiftKey){
			key.preventDefault()
			handleSendMsg()
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
				<Form.Control as='textarea' id='inputMessage' placeholder='Your message goes here' onKeyDown={handleKey}/>
				<Button id='submit' variant='primary' onClick={handleClick}>Send</Button>
		</InputGroup>
		
		</Form>
	</>
	)
}

export default Chat