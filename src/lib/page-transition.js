/**
 *
 * @param {typeof TransitionType[keyof typeof TransitionType]} type
 * @returns
 */
export function getClassToAdd(type) {
	switch (type) {
		case TransitionType.ThumbsToVideo:
			return 'transition-home-to-video';
		case TransitionType.VideoToThumbs:
			return 'transition-video-to-home';
		case TransitionType.VideoToVideo:
			return 'transition-video-to-video';
	}
	// TODO: apply back transition using `delta`
}

/**
 * @enum {string}
 */
export const TransitionType = {
	ThumbsToVideo: 'thumbstovideo',
	VideoToThumbs: 'videotothumbs',
	ThumbsToThumbs: 'thumbstothumbs',
	VideoToVideo: 'videotovideo',
	Back: 'back',
	Other: 'other'
};

/**
 * @param {import('@sveltejs/kit').Navigation} navigation
 * @returns {string}
 */
export function getPageTransitionType(navigation) {
	const to = navigation.to?.url.pathname ?? '';
	const from = navigation.from?.url.pathname ?? '';

	if (to.startsWith('/videos/') && (from === '/' || from.startsWith('/summit-'))) {
		return TransitionType.ThumbsToVideo;
	}
	if (from.startsWith('/videos/') && (to === '/' || to.startsWith('/summit-'))) {
		return TransitionType.VideoToThumbs;
	}
	if ((from === '/' || from.startsWith('/summit-')) && (to === '/' || to.startsWith('/summit-'))) {
		return TransitionType.ThumbsToThumbs;
	}
	if (from.startsWith('/videos/') && to.startsWith('/videos/') && from !== to) {
		return TransitionType.VideoToVideo;
	}
	return TransitionType.Other;
}
