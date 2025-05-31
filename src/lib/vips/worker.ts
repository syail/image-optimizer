import type Vips from 'wasm-vips';

let vips: typeof Vips;

self.onmessage = async (e: MessageEvent) => {
	if (!vips) {
		await import('wasm-vips').then(async (m) => {
			console.log('vips loaded');
			vips = await m.default();
			console.log('vips assigned');
		});
	}
	console.log(e.data);

	try {
		await resizeVariant(e.data.file, e.data.requestId, e.data.quality, e.data.size);
	} catch (error) {
		console.error(error);
		self.postMessage({
			type: 'error',
			requestId: e.data.requestId,
			error
		});
	}
};

const resizeVariant = async (file: File, requestId: string, quality: number, size: number) => {
	const image = vips.Image.newFromBuffer(
		await file.arrayBuffer(),
		['image/gif', 'image/webp'].includes(file.type) ? 'n=-1' : ''
	);

	let scale = 1;

	if (image.width > size || image.height > size) {
		if (image.width > image.height) {
			const ratio = size / image.width;
			scale = ratio;
		} else {
			const ratio = size / image.height;
			scale = ratio;
		}
	}

	const resized = image.resize(scale).webpsaveBuffer({ Q: quality, kmin: 3, kmax: 8 });
	const info = vips.Image.newFromBuffer(resized);

	const blob = new Blob([resized], { type: 'image/webp' });

	self.postMessage({
		type: 'success',
		requestId,
		blob,
		quality,
		converted: {
			width: info.width,
			height: info.height,
			size: blob.size
		},
		original: {
			width: image.width,
			height: image.height,
			size: file.size
		}
	});
};
