export const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
	const response = await fetch(url, options);

	if (!response.ok) {
		throw new Error(`Failed to fetch with status ${response.status}`);
	}
	return response.json() as Promise<T>;
};
