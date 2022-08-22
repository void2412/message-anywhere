import {gql} from '@apollo/client'

export const MESSAGES_SUBSCRIPTION = gql`
subscription Subscription($conversationId: ID!) {
  messages(conversationId: $conversationId) {
    _id
    user {
		_id
      name
    }
    text
  }
}
`

export const CONVERSATIONS_SUBSCRIPTION = gql`
subscription Conversations($userId: ID!) {
  conversations(userId: $userId) {
    _id
    members {
      _id
      email
      name
    }
  }
}
`