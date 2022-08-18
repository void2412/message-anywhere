const { Schema, model } = require('mongoose')
const messageSchema = require('./Message')


const conversationSchema = new Schema({
	messages: [messageSchema],
	members:[{
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	}]
},
{
	toJSON: {
		virtuals: true
	}
})

const Conversation = model('Conversation', conversationSchema)

module.exports = Conversation