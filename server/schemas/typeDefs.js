const {gql} = require('apollo-server-express');

const typeDefs = gql`
	type User {
		_id: ID
		email: String
		password: String
		name: String
		contacts: [User]
	}

	type Conversation {
		_id: ID
		messages: [Message]
		members: [User]!
	}

	type Message {
		_id: ID
		user: User!
		conversation: Conversation!
		text: String!
	}

	type Auth {
		token: ID!
		user: User
	}

	type Query {
		User(userId: ID!): User
		me: User
		conversations: [Conversation]
		conversation(conversationId: ID!): Conversation
		messages(conversationId: ID!): [Message]
	}

	type Mutation {
		addUser(name: String!, email: String!, password: String!): Auth
		login(email: String!, password: String!): Auth
		addConversation(members: [ID]!): Conversation
		addMessage(conversationId: ID!, text: String!): Conversation
		removeMessage(messageId: ID!): Conversation
		editMessage(messageId: ID!, text: String!): Conversation
		addContact(email: String!): User
		removeContact(userId: ID!): User
	}

	type Subscription {
		messages(conversationId: ID!): [Message]
	}
`

module.exports = typeDefs