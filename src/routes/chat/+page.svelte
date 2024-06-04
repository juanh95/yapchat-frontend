<script>
	import { get, writable } from 'svelte/store';
	import { afterUpdate, beforeUpdate, onMount } from 'svelte';

	const websocket_url = import.meta.env.VITE_WEBSOCKET_URL;

	let div;
	let autoscroll = false;

	let checked = true;

	function getCookie(name) {
		const cookieString = document.cookie;
		if (!cookieString) return null;

		const cookies = cookieString.split('; ');
		for (const cookie of cookies) {
			const [key, value] = cookie.split('=');
			if (key === name) {
				return value;
			}
		}

		return null;
	}

	function createMessageListItem(message, sender = null, broadcast = false) {
		const li = document.createElement('li');

		li.textContent = message;

		const username = getCookie('username');

		if (sender == username) {
			li.classList.add('user-message');
			li.style.color = '#21E299';
		} else if (broadcast) {
			li.textContent = message;
		} else {
			li.textContent = `${sender} says: ${message}`;
		}

		return li;
	}

	const connected = writable(false); // Flag for connection status

	let ws; // Variable to hold the websocket object
	let messageList; // Initializing the message list

	beforeUpdate(() => {
		if (div) {
			const scrollableDistance = div.scrollHeight - div.offsetHeight;
			autoscroll = div.scrollTop < scrollableDistance - 20;
		}
	});

	async function connectToWebsocket() {
		try {
			const username = getCookie('username');

			if (username === null) {
				console.log('Invalid Credential Data');
				alert('You will need to sign in first');
				window.location.href = '/login';
			}

			ws = new WebSocket(`${websocket_url}/chat/${username}`); // Specify your server address

			ws.onopen = () => {
				connected.set(true); // Update connection status
			};

			// Handle incoming messages from the server
			ws.onmessage = function ({ data: incomingMessage }) {
				const parsedMessage = JSON.parse(incomingMessage);

				const messageItem = createMessageListItem(
					parsedMessage.message,
					parsedMessage.sender,
					parsedMessage.broadcast
				);

				messageList.appendChild(messageItem);
			};

			ws.onerror = (error) => {
				console.error('Error connecting to websocket:', error);
				connected.set(false); // Update connection status if error occurs
			};
		} catch (error) {
			console.error('Error establishing connection:', error);
			connected.set(false); // Update connection status if error occurs during creation
		}
	}

	let messageInput; // Reference to the message input field

	onMount(async () => {
		await connectToWebsocket();
		messageList = document.getElementById('message-list'); // Get reference on mount
		messageInput = document.getElementById('message-input'); // Get reference on mount,
	}); // Initiate connection on page load

	function sendMessage(event) {
		const username = getCookie('username');
		event.preventDefault(); // Prevent default form submission behavior
		const message = messageInput.value;
		if (message.trim()) {
			// Check for empty message
			const chat_message_data = {
				recipient: 'Broadcast',
				sender: `${username}`,
				message: `${message}`
			};

			const jsonData = JSON.stringify(chat_message_data);
			ws.send(jsonData);

			messageInput.value = ''; // Clear input field after sending
		}
		if (checked) {
			div.scrollTo(0, div.scrollHeight);
		}
	}
</script>

<div class="connection-message" class:connected>
	{#if connected}
		Connected to websocket server!
	{:else}
		Connecting to websocket server...
	{/if}
</div>

<div class="main-page">
	<div class="chat-box" bind:this={div}>
		<ul id="message-list" style="list-style-type: none;"></ul>
	</div>

	<form on:submit={sendMessage}>
		<input type="text" id="message-input" placeholder="Enter message..." />
		<button type="submit">Send</button>
	</form>

	<fieldset>
		<label>
			<input name="terms" type="checkbox" role="switch" bind:checked />
			AutoScroll: {checked ? 'On' : 'Off'}
		</label>
	</fieldset>
</div>

<style>
	.connection-message {
		padding: 1rem;
		background-color: #f5f5f5;
		border: 1px solid #ddd;
		margin-bottom: 1rem;
	}

	.connected {
		color: green;
	}

	.disconnected {
		color: red;
	}

	.chat-box {
		border: 1px solid #ddd;
		padding: 1rem;
		height: 20em;
		overflow-y: auto; /* Enable scrolling for long chat history */
	}

	.main-page {
		/* display: flexbox;
		flex-direction: column; */
		/* Center content horizontally */
		margin: 0 auto; /* Shorthand for margin-left: auto; margin-right: auto; */

		/* Limit content width */
		max-width: 800px; /* Adjust as needed */
		padding: 1rem; /* Add some padding for visual separation */
		height: 100%;
	}
</style>
