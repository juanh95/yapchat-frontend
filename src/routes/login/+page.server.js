const backend_url = import.meta.env.VITE_BACKEND_URL;

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		const jsonData = {
			username: username,
			password: password
		};

		const options = {
			method: 'POST', // Specify the HTTP method as POST
			headers: {
				'Content-Type': 'application/json' // Set the content type header
			},
			body: JSON.stringify(jsonData) // Convert data object to JSON string for body
		};

		try {
			const response = await fetch(`${backend_url}/user/login`, options);

			if (response.ok) {
				const data = await response.json();

				return { success: true, username: username, token: data.token };
			} else {
				console.log('Invaid Credentials Try Again');
				return { success: false };
			}
		} catch (error) {
			console.error('Error sending data:', error);
		}
	}
};
