<template>
	<button>Button Parent</button>
	<br/>
	<Timer msg="Welcome to Your Vue.js + TypeScript App"/>
</template>

<script lang="ts">
	import { Options, Vue } from 'vue-class-component'
	import Timer from '@/components/Timer.vue' // @ is an alias to /src

	@Options({
		components: {
			Timer
		}
	})
	export default class Home extends Vue {}
</script>

<style scoped lang="scss" src="../styles/app/app.scss"></style>
<style scoped lang="scss">
	button {
		color: blue;
	}
</style>
