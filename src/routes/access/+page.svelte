<script>
	function setCookie(username, accessCode) {
		const path = 'path=/'; // Accessible throughout the website

		document.cookie = `username=${username}`;
		document.cookie = `accessCode=${accessCode}`;
		document.cookie = path;
	}

	async function submitForm(event) {
		event.preventDefault(); // Prevent default form submission behavior

		const submittedAccessCode = document.getElementById('accessCode').value;
		const submittedUsername = document.getElementById('username').value;

		const response = await fetch('http://18.188.92.244:80/verifyaccesscode', {
			method: 'POST', // Use POST for sending form data
			headers: { 'Content-Type': 'application/json' }, // Set content type
			body: JSON.stringify({ access_code: submittedAccessCode }) // Send access code and username
		});

		if (response.ok) {
			// Check for successful response (status code 200)

			// Create the cookie with the needed information
			setCookie(submittedUsername, submittedAccessCode);

			// Redirect to a different page
			window.location.href = '/chat'; // Replace with your desired page

			console.log('Login successful!');
		} else {
			console.error('Verification failed:', await response.text()); // Log error message
			alert('Invalid Access Code');
		}
	}
</script>

<div class="login-form">
	<h2>Beta Access</h2>
	<form on:submit={submitForm}>
		<label for="accessCode">Access Code:</label>
		<input type="text" id="accessCode" required />
		<label for="username">Username:</label>
		<input type="text" id="username" required />
		<button type="submit">Login</button>
	</form>
</div>

<style>
	.login-form {
		display: flexbox;
		flex-direction: column;
		/* Center content horizontally */
		margin: 0 auto; /* Shorthand for margin-left: auto; margin-right: auto; */

		/* Limit content width */
		max-width: 800px; /* Adjust as needed */
		padding: 1rem; /* Add some padding for visual separation */
	}
</style>
