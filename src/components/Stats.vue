<template>
	<div class="counter__content flex-auto slider flex flex-col">
		<div
			class="flex-auto log flex flex-col m-1 px-1.5 py-0.5 border border-black relative overflow-y-auto font-mono select-text"
			v-on:click="nextPage()"
		>
			<div class="absolute flex-auto whitespace-pre" style="font-size: 96%" v-text="sessionsReport()"></div>
		</div>
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

	export default {
		props: {
			sessions: {
				type: Object,
				required: false,
				default: true,
			},
		},
		setup(props, context) {
			const sessions = bindProp(props, context, 'sessions')

			function sessionStat(session?) {
				if (!session) {
					session = unref(sessions) && unref(sessions)[dateToString(unref(sessionDate))]
					if (!session) {
						return null
					}
				}

				const stat = Object.keys(session.events)
					.reduce(function(a, key) {
						var event = session.events[key]
						a[event.value] = (a[event.value] || 0) + 1
						return a
					}, {})

				return stat
			}

			function sessionReport() {
				const stat = sessionStat()
				const statStr = stat && Object.keys(stat)
					.map(function(value) {
						return value + ': ' + stat[value]
					})
					.join('\n')
				return statStr
			}

			function sessionsStat(groupByTime) {
				var groups = unref(sessions) && Object.keys(unref(sessions))
					.reduce(function(groups, key) {
						var session = unref(sessions)[key]

						var date = session.date
						if (groupByTime) {
							date -= date % groupByTime
						}

						var _stat = sessionStat(session)
						var sum = 0
						var count = 0

						Object.keys(_stat)
							.forEach(function(value) {
								sum += parseInt(value) * _stat[value]
								count += _stat[value]
							})

						var group = groups[date]
						if (!group) {
							groups[date] = group = {
								date: date,
								sum: sum,
								count: count,
							}
						} else {
							group.sum += sum
							group.count += count
						}

						return groups
					}, {})

				var stat = groups && Object.values(groups).reverse()

				return stat as any
			}

			const reportPage = ref(0)
			const _groupByTimes = [
				0,
				24 * 60 * 60 * 1000,
				7 * 24 * 60 * 60 * 1000,
				30 * 24 * 60 * 60 * 1000,
			]

			function nextPage() {
				reportPage.value++
				if (unref(reportPage) >= _groupByTimes.length) {
					reportPage.value = 0
				}
			}

			function sessionsReport() {
				var stat = sessionsStat(_groupByTimes[unref(reportPage)])

				var statStr = stat && stat
					.map(function(stat) {
						return dateTimeToString(stat.date) + '\t' + stat.sum + '\t' + stat.count + '\t' + (stat.sum / stat.count * 100).toFixed(0) + '%'
					})
					.join('\n')

				return statStr
			}

			return {
				nextPage,
				sessionsReport,
			}
		}
	}

</script>

<style scoped lang="scss" src="../styles/app/app.scss"></style>
<!--<style lang="css" src="../styles/common/tailwind-dev.css"></style>-->
<style scoped lang="scss" src="../styles/common/tailwind.scss"></style>

<style scoped lang="scss">

</style>
