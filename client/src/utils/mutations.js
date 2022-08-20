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
mutation AddContact($userId: ID!) {
  addContact(userId: $userId) {
    _id
    email
    name
    contacts {
      _id
      name
      email
    }
    conversations {
      _id
      members {
        _id
        name
        email
      }
      messages {
        _id
        text
        user {
          _id
          name
        }
      }
    }
  }
}
`

export const removeContact = gql`
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

export const addConversation = gql`
mutation AddConversation($members: [ID]!) {
  addConversation(members: $members) {
    _id
    messages {
      _id
      user {
        _id
        name
        email
      }
      text
    }
    members {
      _id
      name
      email
    }
  }
}
`

export const removeConversationFromUser = gql`
mutation AddConversation($conversationId: ID!) {
  removeConversationFromUser(conversationId: $conversationId) {
    _id
    email
    name
    conversations {
      _id
    }
  }
}
`

export const addMessage = gql`
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

export const removeMessage = gql`
mutation RemoveMessage($messageId: ID!) {
  removeMessage(messageId: $messageId) {
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

export const editMessage = gql`
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