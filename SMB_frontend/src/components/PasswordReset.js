import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import '../styles/PasswordReset.css';

const PasswordReset = () => {
	const [password, setPassword] = useState();
	const [passwordConfirm, setPasswordConfirm] = useState();
	const [notMatched, setNotMatched] = useState(false);
	const [error, setError] = useState('');

	const [searchParams, setSearchParams] = useSearchParams();
	const [message, setMessage] = useState('');

	const passwordConfirmHandler = (e) => {
		if (e.target.value !== password) {
			setNotMatched(true);
		} else {
			setNotMatched(false);
		}
		setPasswordConfirm(e.target.value);
	};

	const submitHandler = async (e) => {
		e.preventDefault();

		fetch('/api/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: searchParams.get('token'),
				password: password
            })
        })
		.then(response => response.json())
		.then(data => {
			console.log('Success');
			setMessage('Password changed successfully!');
			return alert('Password changed successfully!');
		})
		.catch(error => {
			console.error('Error changing password:', error);
			setMessage('Error: Password could not be changed');
		});
	};
	
	return (
		<section className='password-reset'>
			<div className='admin_content'>
				<h3 className='admin_title'>Password Reset</h3>

				<form className='admin_form' onSubmit={submitHandler}>
					<input
						className="admin_input newPass"
						type='password'
						onChange={(e) => setPassword(e.target.value)}
						placeholder='New password'
					/>
					<input
						className='admin_input confirm-pass'
						type='password'
						onChange={passwordConfirmHandler}
						placeholder='Confirm new password'
					/>

					{notMatched && (
						<label className='reset-password_notmatched'>
							Password does not match!
						</label>
					)}
					<div className="forgot-pass-button">
						<button disabled={notMatched} type='submit'>Submit</button>
					</div>

					<p className='changed-pass'>{message}</p>
				</form>
			</div>
		</section>
	);
};

export default PasswordReset;
