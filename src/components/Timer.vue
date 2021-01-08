<template>
	<div class="flex">
		<button class="x bg-gray-500">Button Child</button>
	</div>
</template>

<script lang="ts">
	import { Options, Vue } from 'vue-class-component'

	@Options({
		props: {
			msg: String
		}
	})
	export default class Timer extends Vue {
		msg!: string
	}
</script>

<style scoped lang="scss" src="../styles/common/reset.scss"></style>
<style lang="css" src="../styles/common/tailwind-dev.css"></style>
<!--<style scoped lang="scss" src="../styles/common/tailwind.scss"></style>-->
<style scoped lang="scss" src="../styles/app/common.scss"></style>

<style scoped lang="scss">
	.x {
		color: white;
	}
</style>
