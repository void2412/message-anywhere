import { gql } from '@apollo/client'

export const LOGIN_USER = gql`
mutation LoginUser($email: String!, $password: String!){
	login(email: $email, password: $password){
		token
		user {
			_id
			email
			name
		}
	}
}
`

export const ADD_USER = gql`
mutation AddUser($name: String!, $email: String!, $password: String!){
	addUser(name: $name, email: $email, password: $password) {
		token
		user {
			_id
			email
			name
		}
	}
}
`

export const addContact = gql`
`

export const removeContact = gql`

`

export const addConversation = gql`

`

export const removeConversationFromUser = gql`

`

export const addMessage = gql`

`

export const removeMessage = gql`

`

export const editMessage = gql`

`