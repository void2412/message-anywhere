import React, {useState} from 'react';
import { useQuery } from '@apollo/client';
import { ADD_CONVERSATION, ADD_MESSAGE, REMOVE_CONVERSATION, REMOVE_MESSAGE, EDIT_MESSAGE } from '../utils/mutations';
import { QUERY_CONVERSATIONS } from '../utils/queries';
import Container from 'react-bootstrap/Container'
import Chat from '../components/Chat'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup'
import Auth from '../utils/auth'

const Message = ()=>{
	const token = Auth.getToken()||false
	if(!token || Auth.isTokenExpired(token)){
		window.location.assign('/login')
	}

	const [currentChat, setCurrentChat] = useState('')
	const {loading: conversationLoading, error: conversationError, data: conversationsData} = useQuery(QUERY_CONVERSATIONS)

	const conversationsList = conversationsData?.conversations || []

	const userId = Auth.getUser().data._id
	const handleConversationClick = (event) =>{
		const target = event.target
		const elementList = event.currentTarget.childNodes
		const targetId = target.getAttribute('data-id')
		for (const element of elementList){
			if(element.getAttribute('data-id') === targetId){
				element.classList.add('active')
			}
			else{
				element.classList.remove('active')
			}
		}
		setCurrentChat(targetId)
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
	
	return(
		<Container fluid>
			<Row>
				<Col sm={12} md={3} className='mb-3'>
					{conversationLoading ? 
					(<div>Loading conversation...</div>)
					:
					(<ListGroup onClick={handleConversationClick}>
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