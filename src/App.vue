<template>
	<router-view/>
</template>

<script>
	import {Options, Vue} from "vue-class-component";

	@Options({})
	export default class Timer extends Vue {

	}
</script>

<style lang="scss" src="./styles/app/page.scss"></style>
<style lang="scss">
	[data-v-app] {
		pointer-events: auto;
		touch-action: auto;
	}
</style>
