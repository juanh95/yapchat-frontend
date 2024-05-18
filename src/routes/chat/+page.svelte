<script>
	import { get, writable } from 'svelte/store';
	import { onMount } from 'svelte';

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

	const connected = writable(false); // Flag for connection status

	function createMessageListItem(message, isOutgoing = false) {
		const li = document.createElement('li');
		li.textContent = message;

		if (isOutgoing) {
			li.classList.add('user-message');
			li.style.color = '#21E299';
		}

		return li;
	}

	let ws; // Variable to hold the websocket object
	let messageList; // Initializing the message list

	async function connectToWebsocket() {
		try {
			const username = getCookie('username');
			const access_code = getCookie('accessCode');

			if (username === null) {
				console.log('username is listed as null');
			} else if (access_code === null) {
				console.log('access code is listed as null');
			}

			ws = new WebSocket(`ws://18.188.92.244:80/chat/${username}?access_code=${access_code}`); // Specify your server address

			ws.onopen = () => {
				connected.set(true); // Update connection status
			};

			// Handle incoming messages from the server
			ws.onmessage = function (event) {
				const message = event.data;
				// const messageList = document.getElementById('message-list'); // Assuming an element with this ID exists

				// Create a new list element for the message
				const messageListItem = createMessageListItem(message);

				// Add the list element to the message list container
				messageList.appendChild(messageListItem);
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

	onMount(connectToWebsocket); // Initiate connection on page load

	let messageInput; // Reference to the message input field

	onMount(() => {
		messageList = document.getElementById('message-list'); // Get reference on mount
		messageInput = document.getElementById('message-input'); // Get reference on mount,
	});

	function sendMessage(event) {
		event.preventDefault(); // Prevent default form submission behavior
		const message = messageInput.value;
		if (message.trim()) {
			// Check for empty message
			ws.send(message);
			messageInput.value = ''; // Clear input field after sending
			const messageListItem = createMessageListItem(message, true);
			messageList.appendChild(messageListItem);
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
	<div class="chat-box">
		<ul id="message-list"></ul>
	</div>

	<form on:submit={sendMessage}>
		<input type="text" id="message-input" placeholder="Enter message..." />
		<button type="submit">Send</button>
	</form>
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
		height: 200px;
		overflow-y: scroll; /* Enable scrolling for long chat history */
	}

	.message-list {
		list-style: none; /* Remove default list style */
		padding: 0;
		margin: 0;
	}

	.received-message {
		background-color: #fff;
		color: #666;
	}

	.main-page {
		/* display: flexbox;
		flex-direction: column; */
		/* Center content horizontally */
		margin: 0 auto; /* Shorthand for margin-left: auto; margin-right: auto; */

		/* Limit content width */
		max-width: 800px; /* Adjust as needed */
		padding: 1rem; /* Add some padding for visual separation */
	}
</style>
