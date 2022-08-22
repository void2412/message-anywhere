const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { User, Conversation, Message } = require('../models');
const {PubSub} = require('graphql-subscriptions')




const pubsub = new PubSub()
const pubsubConversation = new PubSub()
const resolvers = {
	Query:{
		User: async (parent, {userId})=>{
			return User.findById(userId)
		},
		
		me: async (parent, args, context)=>{
			if(context.user){
				return User.findOne({_id: context.user._id})
			}
			throw new AuthenticationError('You must be logged in')
		},

		conversations: async (parent, args, context) =>{
			if(context.user){
				return Conversation.find({members: context.user._id})
			}

			throw new AuthenticationError('You must be logged in')
		},

		conversation: async (parent, {conversationId}, context)=>{
			if(context.user){
				return Conversation.findOne({_id: conversationId})
			}

			throw new AuthenticationError('You must be logged in')
		},
		
		messages: async (parent, {conversationId}, context) => {
			if (context.user){
				return Message.find({conversation: conversationId})
			}
			throw new AuthenticationError('You must be logged in')
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
				let membersEditted = []
				for (const member of members){
					let innerUser = await User.findOne({email: member})
					membersEditted.push(innerUser)
				}

				membersEditted.push(context.user._id)
				let check = await Conversation.findOne({members: membersEditted})
				if (check){
					return check
				}

				let conversationCreated = await Conversation.create({members: membersEditted})

				let conversations = await Conversation.find({members: context.user._id})
				pubsubConversation.publish(context.user._id, {conversations})

				return conversationCreated
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

				let messages = await Message.find({conversation: args.conversationId})
				pubsub.publish(args.conversationId, {messages})

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

		addContact: async (parent, {email}, context) =>{
			if(context.user){
				let contactAdded = await User.find({email: email})
				let usereditted = await User.findOneAndUpdate(
					{_id: context.user._id},
					{$addToSet: {contacts: contactAdded[0]._id}},
					{new: true, runValidators: true}
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

	Subscription: {
		messages: {
			subscribe: async (parent, {conversationId}, context) =>{
				const channel = conversationId
				let messages = await Message.find({conversation: conversationId}) || []
				setTimeout(()=> pubsub.publish(channel, {messages}), 0)
				return pubsub.asyncIterator(channel)
			}
		},
		conversations:{
			subscribe: async (parent, {userId}, context) =>{
				const channel = userId
				let conversations = await Conversation.find({members: userId}) || []
				setTimeout(()=> pubsubConversation.publish(channel, {conversations}), 0)
				return pubsubConversation.asyncIterator(channel)
			}
		}
	},

	User: {
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