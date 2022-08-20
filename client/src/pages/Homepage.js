import React,{ useEffect } from 'react';
import Auth from '../utils/auth'
const Home = () => {
	useEffect(() =>{
		if(Auth.loggedIn()){
			window.location.assign('/messages')
		}
		else{
			window.location.assign('/login')
		}

	},[])
  return (
    <></>
  );
};

export default Home;
