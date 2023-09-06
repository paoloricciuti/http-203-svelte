<script>
	import { setupViewTransition } from 'sveltekit-view-transition';

	import { formatDate, ytSrcset } from './utils';
	import { TransitionType, getClassToAdd, getPageTransitionType } from './page-transition';
	/** @type {Record<string, import('./types').Video>}*/
	export let videos;
	const { transition } = setupViewTransition();
</script>

<ol class="video-list">
	{#each Object.entries(videos) as [slug, video] (video.id)}
		{@const href = `/videos/${slug}`}
		<li>
			<a class="video-link" {href}>
				<img
					class="video-thumb"
					srcset={ytSrcset(video.id)}
					alt={video.title}
					use:transition={{
						name: 'embed-container',
						shouldApply({ navigation }) {
							const transition_type = getPageTransitionType(navigation);
							return (
								navigation?.to?.url?.pathname === href &&
								transition_type === TransitionType.ThumbsToVideo
							);
						},
						applyImmediately({ navigation }) {
							const transition_type = getPageTransitionType(navigation);

							return (
								navigation?.from?.url?.pathname === href &&
								transition_type === TransitionType.VideoToThumbs
							);
						}
					}}
				/>
				<p
					class="video-meta"
					use:transition={{
						name: 'video-details',
						shouldApply({ navigation }) {
							return (
								navigation?.to?.url?.pathname === href &&
								document.documentElement.classList.contains(
									getClassToAdd(TransitionType.ThumbsToVideo) ?? ''
								)
							);
						},
						applyImmediately({ navigation }) {
							return (
								navigation?.from?.url?.pathname === href &&
								document.documentElement.classList.contains(
									getClassToAdd(TransitionType.VideoToThumbs) ?? ''
								)
							);
						}
					}}
				>
					<time>{formatDate(new Date(video.published))}</time>
				</p>
			</a>
		</li>
	{/each}
</ol>

<style lang="postcss">
	.video-list {
		display: grid;
		margin: 0;
		padding: var(--content-padding);
		grid-template-columns: var(--video-list-columns, repeat(auto-fill, minmax(300px, 1fr)));
		gap: var(--content-padding);
		background: var(--divider);
		grid-auto-flow: var(--video-list-auto-flow);
		grid-auto-columns: var(--video-list-auto-columns);
		grid-auto-rows: var(--video-list-auto-rows);

		& > li {
			display: block;
			box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
		}
	}

	.video-thumb {
		width: 100%;
		height: auto;
		display: block;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		object-position: center;
		contain: paint;
	}

	.video-meta {
		background: var(--white);
		margin: 0;
		padding: 0.4rem 1rem;
		contain: paint;
	}

	.video-link {
		color: inherit;

		&:hover {
			text-decoration: none;
		}
	}
</style>
