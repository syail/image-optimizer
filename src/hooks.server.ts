import { type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const setWasmHeaders: Handle = ({ event, resolve }) => {
	const { setHeaders } = event;
	setHeaders({
		'Cross-Origin-Embedder-Policy': 'require-corp',
		'Cross-Origin-Opener-Policy': 'same-origin'
	});
	return resolve(event);
};

export const handle = sequence(setWasmHeaders);
