const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
	email:{
		type: String,
		require: true,
		unique: true,
		trim: true,
		match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address'],
		index: true,
		lowercase: true
	},
	password:{
		type: String,
		require: true,
		minLength: 8
	},
	name:{
		type: String,
		require: true
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

userSchema.pre('save', async function(next){
	if(this.isNew || this.isModified('password')){
		const saltRounds = 10
		this.password = await bcrypt.hash(this.password, saltRounds)
	}
	next()
})

userSchema.methods.isCorrectPassword = async function(password){
	return bcrypt.compare(password, this.password)
}

const User = model('User', userSchema)

module.exports = User