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

export const ADD_CONTACT = gql`
mutation AddContact($email: String!) {
  addContact(email: $email) {
    _id
    email
    name
    contacts {
      email
      _id
      name
    }
  }
}
`

export const REMOVE_CONTACT = gql`
mutation AddContact($userId: ID!) {
  removeContact(userId: $userId) {
    _id
    email
    name
    contacts {
      _id
      email
      name
    }
  }
}
`

export const ADD_CONVERSATION = gql`
mutation AddConversation($members: [String]!) {
  addConversation(members: $members) {
    _id
    members {
      _id
      email
      name
    }
    messages {
      _id
      text
      user {
        _id
        email
        name
      }
    }
  }
}
`
export const ADD_MESSAGE = gql`
mutation AddMessage($conversationId: ID!, $text: String!) {
  addMessage(conversationId: $conversationId, text: $text) {
    _id
    messages {
      _id
      text
      user {
        _id
        email
        name
      }
    }
  }
}
`

export const REMOVE_MESSAGE = gql`
mutation RemoveMessage($messageId: ID!) {
  removeMessage(messageId: $messageId) {
    _id
    messages {
      _id
      text
      user {
        _id
        email
        name
      }
    }
  }
}
`

export const EDIT_MESSAGE = gql`
mutation RemoveMessage($messageId: ID!, $text: String!) {
  editMessage(messageId: $messageId, text: $text) {
    _id
    messages {
      _id
      user {
        _id
        email
        name
      }
      text
    }
  }
}
`