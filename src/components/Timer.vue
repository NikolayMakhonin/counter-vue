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
	// import { Options, Vue } from 'vue-class-component'
	import {
		ref, unref, reactive,
		computed, watch, watchEffect,
		onMounted, onUpdated, onUnmounted,
	} from 'vue'
	import { timeToString, delay, beep } from '../helpers/helpers'
	import { noSleep } from '../helpers/noSleep'
	import {bindProp} from "@/helpers/vue";

	// setup: https://v3.vuejs.org/api/composition-api.html#setup
	// watch & computed: https://v3.vuejs.org/guide/reactivity-computed-watchers.html#watching-reactive-objects

	export default {
		props: {
			enabled: {
				type: Boolean,
				required: false,
				default: true,
			},
			soundEnabled: {
				type: Boolean,
				required: false,
				default: true,
			},
			vibrateEnabled: {
				type: Boolean,
				required: false,
				default: false,
			},
			blinkEnabled: {
				type: Boolean,
				required: false,
				default: true,
			},
			time: {
				type: Number,
				required: false,
				default: 120 * 1000,
			},
			interval: {
				type: Number,
				required: false,
				default: 2 * 1000,
			},
			timeRemaining: {
				type: Number,
				required: false,
				default: 120 * 1000,
			},
			intervalRemaining: {
				type: Number,
				required: false,
				default: 2 * 1000,
			},
			started: {
				type: Boolean,
				required: false,
				default: false,
			},
		},
		setup(props, context) {
			const enabled = bindProp(props, context, 'enabled')
			const soundEnabled = bindProp(props, context, 'soundEnabled')
			const vibrateEnabled = bindProp(props, context, 'vibrateEnabled')
			const blinkEnabled = bindProp(props, context, 'blinkEnabled')
			const time = bindProp(props, context, 'time')
			const interval = bindProp(props, context, 'interval')
			const timeRemaining = bindProp(props, context, 'timeRemaining')
			const intervalRemaining = bindProp(props, context, 'intervalRemaining')
			const started = bindProp(props, context, 'started')

			const isBlink = ref(false)

			function _sound() {
				if (unref(soundEnabled)) {
					beep(100, 440, 80)
				}
				if (unref(vibrateEnabled) && navigator.vibrate) {
					navigator.vibrate(50)
				}
				if (unref(blinkEnabled)) {
					isBlink.value = true
					setTimeout(function() {
						isBlink.value = false
					}, 200)
				}
			}

			async function sound(count: number) {
				if (count == null) {
					count = 1
				}

				for(let i = 0; i < count; i++) {
					_sound()
					await delay(600)
				}
			}

			let _timer = null

			function _tick(first) {
				if (unref(timeRemaining) <= 0) {
					stop()
					return
				}

				if (unref(intervalRemaining) <= 0) {
					intervalRemaining.value = unref(interval)
					sound(1)
					if (!first) {
						context.emit('interval-end', null)
					}
				}

				timeRemaining.value -= 1000
				intervalRemaining.value -= 1000
			}

			function start() {
				stop()

				timeRemaining.value = unref(time)
				intervalRemaining.value = 0

				started.value = true

				noSleep.enable()

				_tick(true)
				_timer = setInterval(function() {
					_tick(false)
				}, 1000)
			}

			function stop() {
				if (_timer) {
					clearInterval(_timer)
					_timer = null
				}

				if (unref(started)) {
					sound(3)
					context.emit('interval-end', null)
				}

				started.value = false

				noSleep.disable()
			}

			function startStop() {
				if (unref(started)) {
					stop()
				} else {
					start()
				}
			}

			onUnmounted(() => {
				stop()
			})

			return {
				enabled,
				soundEnabled,
				vibrateEnabled,
				blinkEnabled,

				time,
				interval,
				timeRemaining,
				intervalRemaining,
				started,
				isBlink,

				startStop,
				timeToString,
			}
		}
	}

	// @Options({
	// 	props: {
	// 		enabled: {
	// 			type: Boolean,
	// 			required: false,
	// 			default: true,
	// 		},
	// 		_soundEnabled: {
	// 			type: Boolean,
	// 			required: false,
	// 			default: true,
	// 		},
	// 	},
	// 	emits: ['update:_soundEnabled'],
	// })
	// export class Timer extends Vue {
	// 	enabled: boolean = true
	//
	// 	_soundEnabled: boolean = false
	// 	get soundEnabled(): boolean {
	// 		return this._soundEnabled
	// 	}
	// 	set soundEnabled(value: boolean) {
	// 		this.$emit('update:_soundEnabled', value)
	// 	}
	//
	// 	timeToString = timeToString
	// 	time = 120 * 1000
	// 	interval = 2 * 1000
	// 	timeRemaining = 120 * 1000
	// 	intervalRemaining = 2 * 1000
	// 	started = false
	// 	vibrateEnabled = false
	// 	blinkEnabled = true
	// 	isBlink = false
	// 	onIntervalEnd = false
	// 	_sound() {
	// 		if (this.soundEnabled) {
	// 			beep(100, 440, 80)
	// 		}
	// 		if (this.vibrateEnabled && navigator.vibrate) {
	// 			navigator.vibrate(50)
	// 		}
	// 		if (this.blinkEnabled) {
	// 			var _this = this
	// 			_this.isBlink = true
	// 			setTimeout(function() {
	// 				_this.isBlink = false
	// 			}, 200)
	// 		}
	// 	}
	// 	sound(count: number) {
	// 		if (count == null) {
	// 			count = 1
	// 		}
	//
	// 		// for(i = 0; i < count; i++) {
	// 		//  this._sound()
	// 		//  await delay(100)
	// 		// }
	//
	// 		const _this = this
	//
	// 		let i = 0
	//
	// 		function _recursive() {
	// 			if (i < count) {
	// 				return Promise.resolve().then(function () {
	// 					_this._sound();
	// 					return delay(600);
	// 				}).then(function () {
	// 					i++;
	// 					return _recursive();
	// 				});
	// 			}
	// 		}
	//
	// 		return Promise.resolve().then(function () {
	// 			i = 0;
	// 			return _recursive();
	// 		}).then(function () {});
	// 	}
	// 	_timer = null
	// 	_tick(first) {
	// 		if (this.timeRemaining <= 0) {
	// 			this.stop()
	// 			return
	// 		}
	//
	// 		if (this.intervalRemaining <= 0) {
	// 			this.intervalRemaining = this.interval
	// 			this.sound(1)
	// 			if (!first) {
	// 				this.onIntervalEnd = false
	// 				this.onIntervalEnd = true
	// 			}
	// 		}
	//
	// 		this.timeRemaining -= 1000
	// 		this.intervalRemaining -= 1000
	// 	}
	// 	start() {
	// 		this.stop()
	//
	// 		this.timeRemaining = this.time
	// 		this.intervalRemaining = 0
	//
	// 		this.started = true
	//
	// 		noSleep.enable()
	//
	// 		var _this = this
	// 		_this._tick(true)
	// 		this._timer = setInterval(function() {
	// 			_this._tick(false)
	// 		}, 1000)
	// 	}
	// 	stop() {
	// 		if (this._timer) {
	// 			clearInterval(this._timer)
	// 			this._timer = null
	// 		}
	//
	// 		if (this.started) {
	// 			this.sound(3)
	// 			this.onIntervalEnd = false
	// 			this.onIntervalEnd = true
	// 		}
	//
	// 		this.started = false
	//
	// 		noSleep.disable()
	// 	}
	// 	startStop() {
	// 		if (this.started) {
	// 			this.stop()
	// 		} else {
	// 			this.start()
	// 		}
	// 	}
	// }
</script>

<style scoped lang="scss" src="../styles/app/app.scss"></style>
<style lang="css" src="../styles/common/tailwind-dev.css"></style>
<!--<style scoped lang="scss" src="../styles/common/tailwind.scss"></style>-->

<style scoped lang="scss">
	.x {
		color: white;
	}
</style>
