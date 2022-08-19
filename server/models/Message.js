const { Schema, model } = require('mongoose')

const messageSchema = new Schema({
	user:{
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	conversation:{
		type: Schema.Types.ObjectId,
		ref: 'Conversation',
		required: true
	},
	text:{
		type: String,
		required: true
	}
},
{
	timestamps: true,
	toJSON: {
		getters: true
	}
}
)
const Message = model('Message', messageSchema)

module.exports = Message