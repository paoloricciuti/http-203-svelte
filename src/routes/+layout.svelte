<script>
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { getClassToAdd, getPageTransitionType } from '$lib/page-transition';
	import { setupViewTransition } from 'sveltekit-view-transition';
	import '../app.css';

	$: showBackIcon = $page.url.pathname.includes('/videos');
	let backUrl = '/';

	afterNavigate(({ from, to }) => {
		// TODO: not sure if there's a more idiomatic way
		if (
			(from?.url.pathname.startsWith('/summit-') || from?.url.pathname === '/') &&
			to?.url.pathname.includes('/videos')
		) {
			backUrl = from.url.pathname;
		} else {
			backUrl = '/';
		}
	});

	const { classes } = setupViewTransition();

	afterNavigate(() => {
		classes(({ navigation }) => {
			const retval = [];
			if (navigation.delta && navigation.delta < 0) {
				retval.push('back-transition');
			}
			const to_add = getClassToAdd(getPageTransitionType(navigation));
			if (to_add) {
				retval.push(to_add);
			}
			if (retval.length > 0) {
				return retval;
			}
		});
	});
</script>

<div class="main-layout">
	<header class="header" class:show-back-icon={showBackIcon}>
		<a href={backUrl} class="home-link">
			<svg class="back-icon" viewBox="0 0 24 24">
				<path d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20v-2z" />
			</svg>
			<span class="header-text">Svelte Summit</span>
		</a>
	</header>
	<div class="main">
		<slot />
	</div>
</div>

<!-- <AnimationTool /> -->
<style lang="postcss">
	.main-layout {
		height: 100%;
		display: grid;
		grid-template-rows: auto 1fr;
	}

	.header {
		background: var(--primary-color);
		color: var(--white);
		height: 54px;
		display: grid;
		align-items: center;
		padding: 0 var(--content-padding);
		contain: paint;
		view-transition-name: site-header;
	}

	.show-back-icon.header {
		padding: 0 10px;
	}

	.main {
		overflow-x: hidden;
		overflow-y: auto;
		display: grid;
		grid-template-columns: 100%;

		@media (min-width: 900px) {
			display: block;
		}
	}

	.home-link {
		fill: var(--white);
		color: inherit;
		width: max-content;
		contain: paint;
	}

	.show-back-icon .home-link {
		display: grid;
		grid-template-columns: 31px 1fr;
		align-items: center;
		gap: 0.3rem;
	}

	.back-icon {
		display: none;
	}

	.show-back-icon .back-icon {
		display: block;
	}

	.header-text {
		display: block;
		contain: paint;
		view-transition-name: header-text;
	}
</style>
