<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { langage } from '$lib/stores/language-store';
	import dayjs from 'dayjs';
	import quarterOfYear from 'dayjs/plugin/quarterOfYear';
	import advancedFormat from 'dayjs/plugin/advancedFormat';
	import duration from 'dayjs/plugin/duration';
	import 'dayjs/locale/fr';
	import { PUBLIC_SITE_TITLE, PUBLIC_SITE_URL } from '$env/static/public';
	import { supabase } from '$lib/utils/Public/supabaseClient';
	import { mousePosition } from '$lib/stores/mouse-position-store';
	import { escapeModal } from '$lib/components/Layout/Modal/util-modal';
	dayjs.locale($langage.dayjs);
	dayjs.extend(quarterOfYear);
	dayjs.extend(advancedFormat);
	dayjs.extend(duration);
	let siteTitle = PUBLIC_SITE_TITLE;

	export let data;
	let { sb, session } = data;
	$: ({ sb, session } = data);
	$: if (session) supabase.auth.setSession(session);
	$: if (!session) supabase.auth.signOut();

	onMount(() => {
		const {
			data: { subscription }
		} = sb.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		window.addEventListener('keydown', escapeModal);
		return () => subscription.unsubscribe();
	});

	function handleMouseMove(event: MouseEvent) {
		mousePosition.set({ x: event.clientX, y: event.clientY });
	}
</script>

<svelte:window on:mousemove={handleMouseMove} />

<svelte:head>
	<title>{siteTitle}</title>
	<meta property="og:title" content="Le Yams !" />
	<meta
		property="og:description"
		content="La grille de Yams ne s’est jamais remplie aussi facilement !"
	/>
	<!-- <meta property="og:image" content={`${PUBLIC_SITE_URL}/og-image-bank-data.jpg`} /> -->
	<meta property="og:url" content="https://le-yams.com" />
	<!-- <meta property="og:image:width" content="1024" /> -->
	<!-- <meta property="og:image:height" content="768" /> -->
</svelte:head>

<div
	class="min-h-screen w-full bg-white bg-cover bg-center bg-no-repeat dark:bg-darkMesh dark:text-white"
>
	<slot />
</div>
