export const getYoutubeEmbedUrl = (url) => {
	if (!url) return null;
	try {
		const parsed = new URL(url);
		if (parsed.hostname.includes('youtu.be')) {
			return `https://www.youtube.com/embed/${parsed.pathname.replace('/', '')}`;
		}
		if (parsed.hostname.includes('youtube.com')) {
			const videoId = parsed.searchParams.get('v');
			if (videoId) {
				return `https://www.youtube.com/embed/${videoId}`;
			}
			if (parsed.pathname.startsWith('/embed/')) {
				return url;
			}
		}
	} catch (err) {
		return null;
	}
	return null;
};

const extractDriveFileId = (parsed) => {
	const match = parsed.pathname.match(/\/file\/d\/([^/]+)/);
	if (match?.[1]) {
		return match[1];
	}
	return (
		parsed.searchParams.get('id') ||
		parsed.searchParams.get('fileId') ||
		parsed.searchParams.get('file') ||
		parsed.searchParams.get('resourcekey')
	);
};

export const getDriveEmbedUrl = (url) => {
	if (!url) return null;
	try {
		const parsed = new URL(url);
		if (!/drive\.google\.com|googleusercontent\.com/.test(parsed.hostname)) {
			return null;
		}
		const fileId = extractDriveFileId(parsed);
		return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;
	} catch (err) {
		return null;
	}
};

export const getEmbedUrl = (url) => getYoutubeEmbedUrl(url) || getDriveEmbedUrl(url);
