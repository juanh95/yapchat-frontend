const userLoginUrl = "http://localhost:8000/user/login"

export const actions = {
	default: async ({request}) => {
		const formData = await request.formData();
      const username = formData.get('username');
      const password = formData.get('password');

      const jsonData = {
         "username": username,
         "password": password
      }

      const options = {
         method: 'POST', // Specify the HTTP method as POST
         headers: {
           'Content-Type': 'application/json' // Set the content type header
         },
         body: JSON.stringify(jsonData) // Convert data object to JSON string for body
      };

      try {
         const response = await fetch(userLoginUrl, options);
         console.log(response)
       } catch (error) {
         console.error('Error sending data:', error);
       }
	}
};