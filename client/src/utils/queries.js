import {gql} from '@apollo/client'

export const QUERY_USER = gql`
	query User($userId: ID!){
		User(userId: $userId){
			_id
			name
		}
	}
`

export const QUERY_ME = gql`
	query  me {
    	_id
    	email
    	name
    	conversations {
    	  _id
    	  messages {
    	    _id
    	    text
    	    user {
    	      _id
    	      name
    	    }
    	  }
    	  members {
    	    _id
    	    name
    	  }
    	}
		contacts {
      		_id
      		name
    	}
	}
  }
`