<script>
	import { onMount } from 'svelte';
	/** @type {import('./$types').ActionData} */
	export let form;

	onMount(() => {
		if (form?.success) {
			document.cookie = `username=${form.username}`;
			console.log(`What showed up was: ${form.username}`);
			const path = 'path=/';
			document.cookie = path;
			document.cookie = `token=${form.token}`;
			window.location.href = '/chat';
		}
	});
</script>

<div class="container">
	<h1 style="text-align: center;">Login</h1>
	<form method="POST" action="">
		<input type="text" id="username" name="username" placeholder="Username" required />
		<input type="password" id="password" name="password" placeholder="Password" />
		<button type="submit">Login</button>
	</form>
</div>
