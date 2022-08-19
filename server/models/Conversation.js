const { Schema, model } = require('mongoose')



const conversationSchema = new Schema({
	messages: [{
		type: Schema.Types.ObjectId,
		ref: 'Message'
	}],
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