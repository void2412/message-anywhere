import React, {useState, useEffect} from 'react';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { ADD_CONVERSATION, ADD_MESSAGE, REMOVE_CONVERSATION, REMOVE_MESSAGE, EDIT_MESSAGE } from '../utils/mutations';
import { QUERY_CONVERSATIONS, QUERY_ME } from '../utils/queries';
import { CONVERSATIONS_SUBSCRIPTION } from '../utils/subscriptions';
import Container from 'react-bootstrap/Container'
import Chat from '../components/Chat'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup'
import Auth from '../utils/auth'

const Message = (props)=>{
	const token = Auth.getToken()||false
	if(!token || Auth.isTokenExpired(token)){
		window.location.assign('/login')
	}

	const [currentChat, setCurrentChat] = useState('')
	const userId = Auth.getUser().data._id
	const {loading: meLoading, error: meError, data: meData} = useQuery(QUERY_ME)
	const currentuserData = meData?.me || {}
	const {loading: conversationLoading, error: conversationError, data: conversationsData} = useSubscription(CONVERSATIONS_SUBSCRIPTION,{variables:{userId: userId}})
	

	const [addConversation] = useMutation(ADD_CONVERSATION)
	
	const conversationsList = conversationsData?.conversations || []
	
	const handleConversationClick = (event) =>{
		const target = event.target
		const targetId = target.getAttribute('data-id')
		handleColorChange(targetId)
		setCurrentChat(targetId)
	}

	const handleColorChange = (id)=>{
		let parent = document.querySelector("#conversationList")
		let childs = parent.childNodes
		for (const element of childs){
			if(element.getAttribute('data-id') === id){
				element.classList.add('active')
			}
			else{
				element.classList.remove('active')
			}
		}
	}


	const getMembers = (conversation)=>{
		let returnString = ``
		for (const member of conversation.members){
			if(member._id !== userId){
				returnString += `${member.name}, `
			}
		}
		returnString = returnString.slice(0,-2)
		return returnString
	}
	
	const handleAddCon = async ()=>{
		let data = document.querySelector('#memberBox').value.trim()
		data = data.split(' ')
		let returnData = await addConversation({variables: {members: data}})
		let id = returnData.data.addConversation._id
		handleColorChange(id)
		setCurrentChat(id)

	}

	return(
		<Container fluid>
			<InputGroup className="mb-3">
				<Form.Control as="input" id="memberBox" placeholder='Who do you want to send messages? (email, seperate by space)' />
				<Button variant='primary' onClick={handleAddCon}>Start Chat</Button>
			</InputGroup>
			
			<Row>
				<Col sm={12} md={3} className='mb-3'>
					{conversationLoading ? 
					(<div>Loading conversation...</div>)
					:
					(<ListGroup onClick={handleConversationClick} id="conversationList">
						{conversationsList.map((conversation)=>{
							return(
								<ListGroup.Item as='button' className='list-group-item-action' key={conversation._id} data-id={conversation._id}>
									{getMembers(conversation)}
								</ListGroup.Item>
							)
						})}
					</ListGroup>)
					}
				</Col>
				<Col sm={12} md={9}>
					
					{currentChat ?
					(<Chat conversationId={currentChat}/>)
					:
					(<div className=''> Select Conversation to start chatting</div>)
					}
					
				</Col>
			</Row>
		</Container>
	)
}

export default Message