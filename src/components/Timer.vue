<template>
	<div class="timer flex">
		<label class="no-select no-drag">
			<input
				type="checkbox"
				class="collapsed-focus"
				value="value"
				v-model="soundEnabled"
			/>
			<div
				class="flex-none m-1 h-12 w-12 button click-shift checked-invert relative border border-black"
			>
				<span
					class="icon icon-mask icon--volume-high bg-black"
				>&nbsp;</span>&nbsp;
			</div>
		</label>
		<div
			class="flex-1 m-1 h-12 px-1.5 py-1 border border-black font-bold relative"
			:class="{'collapsed': !started}"
		>
			<div
				class="absolute inset-y-0 left-0 bg-gray-400"
				:style="'width: ' + (timeRemaining / time * 100) + '%'"
				></div>
			<div
				class="absolute inset-0 content-center">{{
					timeToString(timeRemaining)
				}}</div>
		</div>
		<div
			class="flex-1 m-1 h-12 px-1.5 py-1 border border-black font-bold relative"
			:class="{'collapsed': !started}"
		>
			<div
				class="absolute inset-y-0 left-0 bg-gray-400"
				:style="'width: ' + (intervalRemaining / interval * 100) + '%'"
				></div>
			<div
				class="absolute inset-0 content-center">{{
					timeToString(intervalRemaining)
				}}</div>
		</div>
		<select
			class="flex-1 m-1 h-12 px-1.5 py-1 border border-black content-center disabled-opacity"
			v-model="time"
			:class="{'collapsed': started}"
			:disabled="!enabled"
		>
			<template v-for="value in [60, 120, 180, 240, 300, 600, 900, 1200, 1500, 1800, 2400, 3600, 5400, 7200, 14400, 10800, 21600, 25200, 28800, 32400, 36000, 39600, 43200, 46800, 50400, 54000, 57600]">
				<option :value="value * 1000">{{
					timeToString(value * 1000)
				}}</option>
			</template>
		</select>
		<select
			class="flex-1 m-1 h-12 px-1.5 py-1 border border-black content-center disabled-opacity"
			v-model="interval"
			:class="{'collapsed': started}"
			:disabled="!enabled"
		>
			<template v-for="value in [1, 2, 3, 4, 5, 10, 15, 20, 30, 40, 60, 120, 180, 240, 300, 600, 900, 1200, 1500, 1800, 2400, 3600, 5400, 7200]">
				<option :value="value * 1000">{{
					timeToString(value * 1000)
				}}</option>
			</template>
		</select>
		<button
			class="flex-none m-1 h-12 w-12 button click-shift checked-invert disabled-opacity relative border border-black"
			v-on:click="startStop()"
			:class="{'bg-gray-200': started}"
			:disabled="!enabled"
		>
			<span
				class="icon icon-mask bg-black"
					:class="{
						'icon--play': !started,
						'icon--stop': started,
					}"
			>&nbsp;</span>&nbsp;
		</button>
	</div>
</template>

<script lang="ts">
	import { Options, Vue } from 'vue-class-component'
	import { timeToString } from '../helpers/helpers'

	@Options({
		props: {
			enabled: {
				type: Boolean,
				required: false,
				default: true,
			},
			_soundEnabled: {
				type: Boolean,
				required: false,
				default: true,
			},
		},
		emits: ['update:_soundEnabled'],
	})
	export default class Timer extends Vue {
		enabled: boolean = true
		_soundEnabled: boolean = false
		get soundEnabled(): boolean {
			return this._soundEnabled
		}
		set soundEnabled(value: boolean) {
			this.$emit('update:_soundEnabled', value)
		}
		started: boolean = false
		time: number = 120 * 1000
		timeRemaining: number = 0
		interval: number = 5 * 1000
		intervalRemaining: number = 0

		timeToString = timeToString

		startStop() {
			console.log('startStop')
			// TODO
		}
	}
</script>

<style scoped lang="scss" src="../styles/app/app.scss"></style>
<style lang="css" src="../styles/common/tailwind-dev.css"></style>
<!--<style scoped lang="scss" src="../styles/common/tailwind.scss"></style>-->

<style scoped lang="scss">
	.x {
		color: white;
	}
</style>
