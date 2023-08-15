<script lang="ts">
	import type { Person } from 'lemmy-js-client';
	import EntityIcon from './EntityIcon.svelte';

	export let showAvatar: boolean;
	export let person: Person;
</script>

<div class="userTag">
	{#if showAvatar && person.avatar}
		<EntityIcon src={person.avatar} alt="Avatar" />
	{/if}
	{person.name}
	{#if !person.local}
		<span
			class="userTag__externalIndicator"
			title={`External user from ${new URL(person.actor_id).hostname}`}
		>
			<span class="material-icons">link</span>
		</span>
	{/if}
</div>

<style lang="scss">
	@use 'material-icons/iconfont/filled.css';

	.userTag {
		&,
		.userTag__externalIndicator {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 0.3rem;
		}

		.userTag__externalIndicator {
			.material-icons {
				font-size: 0.9rem;
			}
		}
	}
</style>
