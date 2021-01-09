<template>
	<div class="counter__buttons flex justify-between">
		<template v-for="val in [0, 1]">
			<label class="no-select no-drag">
				<input
					type="radio"
					class="collapsed-focus"
					:value="val"
					v-model="value"
					:disabled="enabled"
				/>
				<div
					class="button click-shift checked-invert disabled-opacity m-1 w-36 h-36 relative border border-black"
					v-on:touchstart="setValue(val)"
					v-on:mousedown="setValue(val)"
				>
					<span
						class="icon icon-mask bg-black"
						:class="{['icon--numeric-' + val]: true}"
					>&nbsp;</span>&nbsp;
				</div>
			</label>
		</template>
	</div>
</template>

<script lang="ts">
	// import { Options, Vue } from 'vue-class-component'
	import {
		ref, unref, reactive,
		computed, watch, watchEffect,
		onMounted, onUpdated, onUnmounted,
	} from 'vue'
	import { timeToString, dateTimeToString, delay, beep } from '../helpers/helpers'
	import {bindProp} from "@/helpers/vue";

	// setup: https://v3.vuejs.org/api/composition-api.html#setup
	// watch & computed: https://v3.vuejs.org/guide/reactivity-computed-watchers.html#watching-reactive-objects

	function dateToString(date) {
		if (typeof date !== 'number') {
			date = date.getTime()
		}

		return date.toString().padStart(15, '0')
	}

	export default {
		props: {
			enabled: {
				type: Boolean,
				required: false,
				default: true,
			},
			value: {
				type: Number,
				required: false,
				default: true,
			},
		},
		setup(props, context) {
			// TODO: !timer.started || timer.interval - timer.intervalRemaining < 3000
			const enabled = bindProp(props, context, 'enabled')
			const value = bindProp(props, context, 'value')

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

			const sessions = ref(null)

			return {
				enabled,
				value,
				setValue,
			}
		}
	}

</script>

<style scoped lang="scss" src="../styles/app/app.scss"></style>
<!--<style lang="css" src="../styles/common/tailwind-dev.css"></style>-->
<style scoped lang="scss" src="../styles/common/tailwind.scss"></style>

<style scoped lang="scss">

</style>
