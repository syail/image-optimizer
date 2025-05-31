import { env } from '$env/dynamic/private';

export const load = () => {
	return {
		version: env.COMMIT_SHA?.slice(0, 7) || 'unknown'
	};
};
