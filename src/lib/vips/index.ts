import { browser } from '$app/environment';
import VipsWorker from './worker?worker';

export interface VipsResponse {
	blob: Blob;
	quality: number;
	converted: {
		width: number;
		height: number;
		size: number;
	};
	original: {
		width: number;
		height: number;
		size: number;
	};
}

class VipsService {
	private workers: Worker[] = [];
	private processing = new Map<
		string,
		{ resolve: (value: VipsResponse) => void; reject: (reason?: unknown) => void }
	>();

	constructor() {
		if (browser) {
			const worker = new VipsWorker({});
			worker.addEventListener('message', this.handler.bind(this));
			worker.onmessage = (event) => this.handler(event);
			this.workers.push(worker);
		}
	}

	async resize(file: File, quality: number, size: number): Promise<VipsResponse> {
		return new Promise((resolve, reject) => {
			try {
				const requestId = crypto.randomUUID();
				this.processing.set(requestId, {
					resolve,
					reject
				});

				this.workers[0].postMessage({ file, op: 'RESIZE', requestId, quality, size });
			} catch (error) {
				console.error(error);
				reject(error);
			}
		});
	}

	handler(event: MessageEvent) {
		console.log('vips: handler received event', event);

		const req = this.processing.get(event.data.requestId);
		if (req) {
			req.resolve(event.data);
		}
	}
}

export default new VipsService();
