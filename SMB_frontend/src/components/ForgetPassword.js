import React, { useState } from "react";

import '../styles/ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		setLoading(true);
		fetch('/api/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email
            })
        })
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			  }
			  return response.json();
			})
			.then(data => {
			  setLoading(false);
			  console.log('Email sent');
			  setMessage('Password reset email sent');
			  return alert('Reset password form sent successfully! Please check your email.');
			})
			.catch(error => {
			  setLoading(false);
			  setMessage('Error: Invalid email');
			  console.error('Error sending email:', error);
			});
	};

  return (
	<section className="admin">
		<div className='admin_content'>
			<h3 className="admin_title">Forgot Password</h3>
			<form className="admin_form" onSubmit={handleSubmit}>
				<label className='forgot-pass-label' htmlFor='email'>Email:</label>
				<input
					className="admin_input forgot-pass-input"
					type='email'
					id='email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder='Please enter your email here'
				/>
				<div className="forgot-pass-button">
					<button type='submit'>{loading ? 'Sending...' : 'Submit'}</button>
				</div>
			</form>
			{message && <p className='forgot-pass-message'>{message}</p>}
		</div>
	</section>
	);
}
