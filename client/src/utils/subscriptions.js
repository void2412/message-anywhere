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