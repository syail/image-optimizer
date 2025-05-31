<script lang="ts">
	let opened = $state(false);
	let logs = $state<string[]>([]);

	export const open = () => {
		reset();
		opened = true;
	};

	export const reset = () => {
		logs = [];
	};

	export const addLog = (log: string) => {
		logs.push(log);
	};
</script>

{#if opened}
	<div class="absolute inset-0 flex items-center justify-center bg-black/50">
		<modal class="flex flex-col gap-2 h-72 overflow-y-auto w-full max-w-md p-4 rounded-md bg-white">
			<h2 class="text-lg font-semibold">In progress...</h2>
			<div class="flex flex-col gap-2 bg-gray-100 p-1 h-full overflow-y-auto">
				{#each logs as log, index (index)}
					<div class="text-sm">{log}</div>
				{/each}
			</div>
			<button class="bg-blue-500 text-white px-4 py-2 rounded-md" onclick={() => (opened = false)}>
				Close
			</button>
		</modal>
	</div>
{/if}
