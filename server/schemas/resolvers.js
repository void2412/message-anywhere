const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { User, Conversation, Message } = require('../models');

const resolvers = {
	Query:{
		User: async (parent, {userId})=>{
			return await User.findById(userId)
		},
		
		me: async (parent, args, context)=>{
			if(context.user){
				let userMe = await User.findById(context.user._id)
				return userMe
			}
			throw new AuthenticationError('You must be logged in')
		},

		conversations: async (parent, args, context) =>{
			if(context.user){
				if(context.user.conversations && context.user.conversations.length > 0){
					return Conversation.find({members: context.user._id})
				}
				else{
					return null
				}
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
			const userAdded = await User.create({name, email, password})
			const user = await User.findById(userAdded._id)
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
				members.push(context.user._id)
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
				let usereditted = await User.findByIdAndUpdate(
					context.user._id,
					{$addToSet: {contacts: userId}},
					{new: true}
					)
				return usereditted
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
	},

	User: {
		conversations: async (parent)=>{
			return await Conversation.find({_id: {$in: parent.conversations}})
		},
		contacts: async (parent)=>{
			return await User.find({_id: {$in: parent.contacts}})
		}
	},

	Conversation: {
		messages:  async (parent)=>{
			return await Message.find({_id: {$in: parent.messages}})
		},
		members: async (parent)=>{
			return await User.find({_id: {$in: parent.members}})
		}
	},

	Message: {
		user: async (parent)=>{
			return await User.findById(parent.user)
		},
		conversation: async (parent)=>{
			return await Conversation.findById(parent.conversation)
		}
	}
}

module.exports = resolvers