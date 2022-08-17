const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
	email:{
		type: String,
		require: true,
		unique: true,
		trim: true,
		match: [/^[a-zA-Z0-9.! #$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\. [a-zA-Z0-9-]+)*$/, 'Please enter a valid email address'],
		index: true
	},
	password:{
		type: String,
		require: true,
		minLength: 8
	},
	contacts:[{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}]
},

{
	toJSON: {
		virtuals: true
	}
}
)

userSchema.virtual('contactCount').get(function(){
	return this.contacts.length
})

const User = model('User', userSchema)

module.exports = User