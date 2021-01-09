<template>
	<div>
		<FixationButtons
			v-model:enabled="fixationButtonsEnabled"
			v-model:value="value"
			v-on:click="buttonSound()"
			/>
		<Timer
			:enabled="enabled"
			v-model:soundEnabled="soundEnabled"
			v-model:vibrateEnabled="vibrateEnabled"
			v-model:blinkEnabled="blinkEnabled"
			v-on:interval-end="onIntervalEnd()"
			/>
		<Stats
			v-model:sessions="sessions"
			/>
	</div>
</template>

<script>
	import FixationButtons from "./FixationButtons";
	import Timer from "./Timer";
	import {bindProp} from "../helpers/vue";
	import {ref, unref} from "vue";

	export default {
		components: {Timer, FixationButtons},
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
			sessions: {
				type: Object,
				required: false,
				default: true,
			},
		},
		setup(props, context) {
			const enabled = bindProp(props, context, 'enabled')
			const soundEnabled = bindProp(props, context, 'soundEnabled')
			const vibrateEnabled = bindProp(props, context, 'vibrateEnabled')
			const blinkEnabled = bindProp(props, context, 'blinkEnabled')
			const sessions = bindProp(props, context, 'sessions')

			const fixationButtonsEnabled = computed(() => {
				return unref(enabled)
					&& (!unref(started) || unref(interval) - unref(intervalRemaining) < 3000)
			})

			const sessionDate = ref(null)
			function newSession() {
				sessionDate.value = Date.now()
			}

			function setValue(o) {
				value.value = o
				context.emit('click', null)
				// TODO:
				// if (timer.soundEnabled) {
				// 	beep(100, 523.2511306, 80)
				// }
			}

			function buttonSound(o) {
				if (soundEnabled) {
					beep(100, 523.2511306, 80)
				}
			}

			function onIntervalEnd() {
				// TODO
			}

			function addValue(db, uid, value) {
				if (value == null) {
					value = unref(value) && parseInt(unref(value)) || 0
					value.value = null
				}

				if (!unref(sessionDate)) {
					throw new Error('unref(sessionDate) is empty')
				}

				var date = Date.now()

				db.ref(
					'counter/' + uid
					+ '/sessions/' + dateToString(unref(sessionDate))
				)
					.update({
						date: unref(sessionDate),
						['events/' + dateToString(date)]: {
							date: date,
							value: value,
						},
					})
					.catch(function(err) {
						console.log(err)
					})
			}

			// reports

			return {
				enabled,
				value,
				setValue,
				buttonSound,
			}
		}
	}
</script>
