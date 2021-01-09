import { computed } from 'vue'

export function bindProp(props, contextOrEmit, name) {
	const emit = typeof contextOrEmit === 'function'
		? contextOrEmit
		: contextOrEmit.emit

	return computed({
		get: () => props[name],
		set: (value) => emit(`update:${name}`, value)
	})
}
