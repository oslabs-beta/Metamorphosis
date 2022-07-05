import React from 'react'
import { useAuth0 } from '@auth0/auth0-react';


const login = () => {
	const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

	return (
		<div className='home'> 
		{
			!isAuthenticated && (
				<div className='login-pg'>
					<h1 className='landing-title'> Welcome to Metamorphosis </h1>
					<button className='login' onClick={()=> loginWithRedirect()}>Log In</button>
				</div>
			)

		}
		{
			isAuthenticated && (
				<div className='logout-pg'>
				<button className='logout' onClick={() => logout({ returnTo: window.location.origin })}>
					Log Out	
				</button>
			</div>
			)
		}
		</div>
	)
}

export default login;