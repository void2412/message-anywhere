import {gql} from '@apollo/client'

export const QUERY_USER = gql`
	query User($userId: ID!){
		User(userId: $userId){
			_id
			email
			name
		}
	}
`

export const QUERY_ME = gql`
query Me {
  me {
    _id
    name
    email
    contacts {
      _id
      name
      email
    }
  }
}
`

export const QUERY_CONVERSATIONS = gql`
query Conversations {
  conversations {
    _id
    members {
      _id
      name
      email
    }
  }
}
`

export const QUERY_MESSAGES = gql`
query Messages($conversationId: ID!) {
  messages(conversationId: $conversationId) {
    _id
    text
    user {
      _id
      name
    }
  }
}
`

export const QUERY_CONTACTS = gql`
query Contacts {
  contacts {
    _id
    email
    name
  }
}
`