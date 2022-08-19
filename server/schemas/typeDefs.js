const {gql} = require('apollo-server-express');

const typeDefs = gql`
	type User {
		_id: ID
		email: String
		password: String
		name: String
		conversations: [Conversation]
		contacts: [User]
	}

	type Conversation {
		_id: ID
		messages: [Messages]
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
		User: User
	}

	type Query {
		User(userId: ID!): User
		me: User
		conversations: Conversation
		messages(conversationId: ID!): Messages
	}

	type Mutation {
		addUser(name: String!, email: String!, password: String!): Auth
		login(email: String!, password: String!): Auth
		addConversation(members: [ID]!): Conversation
		removeConversationFromUser(conversationId: ID!): User
		addMessage(conversationId: ID!, text: String!): Conversation
		removeMessage(messageId: ID!): Conversation
		editMessage(messageId: ID!, text: String!): Conversation
		addContact(userId: ID!): User
		removeContact(userId: ID!): User
	}
`

module.exports = typeDefs