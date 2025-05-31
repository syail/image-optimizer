<script lang="ts">
	import '../app.css';

	const { children, data } = $props();

	const { version } = data;
</script>

<svelte:head>
	<title>Image Optimizer</title>
</svelte:head>

<div class="container px-4 py-2 mx-auto">
	<header>
		<div class="flex items-center gap-2">
			<img src="/favicon.png" alt="logo" class="size-8" />
			<h2 class="font-semibold text-lg">Image Optimizer</h2>
			<span class="text-sm text-gray-500">{version}</span>
		</div>
	</header>
	<main>
		{@render children()}
	</main>
</div>
