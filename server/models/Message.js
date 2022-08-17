const { Schema, model } = require('mongoose')

const messageSchema = new Schema({
	user:{
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	text:{
		type: String
	}
},
{
	timestamps: true,
	toJSON: {
		getters: true
	}
}
)


module.exports = messageSchema