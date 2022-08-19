const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { User, Conversation, Message } = require('../models');

const resolvers = {
	Query:{
		User: async (parent, {userId})=>{
			return User.findById(userId)
		},
		
		me: async (parent, args, context)=>{
			if(context.user){
				return User.findById(context.user._id)
			}
			throw new AuthenticationError('You must be logged in')
		},

		conversations: async (parent, args, context) =>{
			if(context.user){
				return Conversation.find({members: context.user._id})
			}

			throw new AuthenticationError('You must be logged in')
		},
		
		messages: async (parent, {conversationId}, context) => {
			if (context.user){
				return Message.find({conversation: conversationId})
			}
		}
	},

	Mutation: {
		addUser: async (parent, {name, email, password}) =>{
			const user = await User.create({name, email, password})
			const token = signToken
			return {token, user}
		},

		login: async (parent, {email, password}) =>{
			const user = await User.findOne({email: email})

			if(!user){
				throw new AuthenticationError('No user with this ID')
			}

			const checkPw = await user.isCorrectPassword(password)

			if(!checkPw){
				throw new AuthenticationError('Incorrent password')
			}

			const token = signToken(user)
			return {token, user}
		},

		addConversation: async (parent, {members}, context) =>{
			if(context.user){
				return Conversation.create({members: members})
			}
			throw new AuthenticationError('You must be logged in')
		},

		removeConversationFromUser: async (parent, {conversationId}, context) =>{
			if(context.user){
				return User.findOneAndUpdate(
					{_id: context.user._id},
					{$pull: {conversations: conversationId}},
					{new: true}
				)
			}

			throw new AuthenticationError('You must be logged in')
		},

		addMessage: async (parent, args, context) => {
			if(context.user){
				let messageAdded = await Message.create({
					user: context.user._id,
					conversation: args.conversationId,
					text: args.text
				})

				return Conversation.findOneAndUpdate(
					{_id: args.conversationId},
					{ $addToSet: {messages: messageAdded._id} },
					{new: true, runValidators: true}
				)

				
			}

			throw new AuthenticationError('You must be logged in')
		},

		removeMessage: async (parent, {messageId}, context) => {
			if(context.user){
				let messageDeleted = await Message.findByIdAndDelete(messageId)
				return Conversation.findOneAndUpdate(
					{_id: messageDeleted.conversation},
					{$pull: {messages: messageId}},
					{new: true}
				)
			}

			throw new AuthenticationError('You must be logged in')
		},

		editMessage: async (parent, {messageId, text}, context) =>{
			if(context.user){
				let messageEditted = await Message.findByIdAndUpdate(
					{_id: messageId},
					{text: text},
					{new: true}
				)
				return Conversation.findById(messageEditted.conversation)
			}

			throw new AuthenticationError('You must be logged in')
		},

		addContact: async (parent, {userId}, context) =>{
			if(context.user){
				return User.findByIdAndUpdate(
					context.user._id,
					{$addToSet: {contacts: userId}},
					{new: true}
					)
			}

			throw new AuthenticationError('You must be logged in')
		},

		removeContact: async(parent, {userId}, context) =>{
			if(context.user){
				return User.findByIdAndUpdate(
					context.user._id,
					{$pull: {contacts: userId}},
					{new: true}
				)
			}

			throw new AuthenticationError('You must be logged in')
		}
	}
}

module.exports = resolvers