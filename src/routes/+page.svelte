<script lang="ts">
	import VipsService, { type VipsResponse } from '$lib/vips';
	import { LoadingIcon, TrashIcon, UploadIcon } from '$components/icon';
	import { formatBytes } from 'bytes-formatter';
	import { downloadZip } from 'client-zip';

	const WEBP_MAX_RESOLUTION = 16383;

	let loading = $state(false);

	let quality = $state(80);
	let limitSize = $state(false);
	let size = $state(256);

	let images: VipsResponse[] = $state([]);

	const onchange = async (e: Event) => {
		if (!(e.target instanceof HTMLInputElement) || !e.target.files) return;

		transformImages(e.target.files);
	};

	const onClick = () => {
		document.getElementById('file')?.click();
	};

	const onKeyDown = () => {};

	const onDrop = (e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!e.dataTransfer?.files) return;

		transformImages(e.dataTransfer.files);
	};

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
	};

	const handleEnter = (e: DragEvent) => {
		e.preventDefault();
	};

	const handleLeave = (e: DragEvent) => {
		e.preventDefault();
	};

	const transformImages = async (files: FileList) => {
		loading = true;

		const validTypeFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));

		for (const file of validTypeFiles) {
			const res = await VipsService.resize(file, quality, limitSize ? size : WEBP_MAX_RESOLUTION);

			images.push(res);
		}
		loading = false;
	};

	const onDelete = (item: VipsResponse) => {
		images = images.filter((i) => i !== item);
	};

	const downloadAll = async () => {
		const blob = await downloadZip(
			images.map((i) => ({ name: `${crypto.randomUUID()}.webp`, input: i.blob }))
		).blob();

		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'images.zip';
		link.click();
		link.remove();
	};
</script>

<div>
	<h2 class="text-lg font-semibold">Options</h2>
	<div class="flex flex-col gap-2">
		<label for="quality">Quality</label>
		<input
			class="border border-gray-300 rounded-md px-2 py-1"
			type="number"
			id="quality"
			min="0"
			max="100"
			bind:value={quality}
		/>
	</div>
	<div class="flex flex-col gap-2">
		<div>
			<input type="checkbox" id="limitSize" bind:checked={limitSize} />
			<label for="limitSize">Max resolution limit (width and height both)</label>
		</div>
		<input
			class="border border-gray-300 rounded-md px-2 py-1 disabled:opacity-50"
			type="number"
			id="size"
			min="0"
			max="100"
			disabled={!limitSize}
			bind:value={size}
		/>
	</div>
</div>
<div
	class="mt-2 relative text-gray-800 border-dashed border-2 border-gray-500 rounded-md p-2 hover:bg-gray-100 cursor-pointer"
	onclick={onClick}
	onkeydown={onKeyDown}
	ondrop={onDrop}
	ondragover={handleDragOver}
	ondragenter={handleEnter}
	ondragleave={handleLeave}
	role="button"
	tabindex="0"
>
	<UploadIcon class="size-12" />
	<label for="file" class="text-lg">Drag and drop or click here</label>
	<input type="file" id="file" {onchange} class="hidden" multiple />

	{#if loading}
		<div class="absolute inset-0 flex items-center justify-center bg-white/50">
			<LoadingIcon class="size-12" />
		</div>
	{/if}
</div>

<div class="mt-4 flex gap-2">
	<button class="bg-red-500 text-white px-4 py-2 rounded-md" onclick={() => (images = [])}>
		Clear All
	</button>
	<button class="bg-blue-500 text-white px-4 py-2 rounded-md" onclick={downloadAll}>
		Download All
	</button>
</div>

<div class="flex flex-wrap gap-4 mt-4">
	{#each images as image (image)}
		<div class="p-2 border border-gray-300 rounded-md relative">
			<img
				src={URL.createObjectURL(image.blob)}
				alt="converted"
				class="size-48 aspect-auto object-contain"
			/>
			<p class="text-sm text-gray-900">
				{image.converted.width}x{image.converted.height}
				Q{image.quality}%
			</p>
			<p class="text-sm text-gray-500">
				{formatBytes(image.original.size)} → {formatBytes(image.converted.size)}
			</p>
			<p class="text-sm text-gray-500">
				(
				{(((image.original.size - image.converted.size) / image.original.size) * 100).toFixed(2)}%
				Optimized )
			</p>
			<button
				class="absolute top-0 right-0 p-1 rounded-md bg-white/50"
				onclick={() => onDelete(image)}
			>
				<TrashIcon class="size-6 text-red-500" />
			</button>
		</div>
	{/each}
</div>
