import { useLocalStorage } from "@vueuse/core"
import { ref, watch } from "vue"

type UseSettingsOptions<T = {}> = {
  id: string
  defaultSettings: T
  validateEach?: {
    [key in keyof T]: {
      valid: (value: T[key]) => boolean
      message: string
    }
  }
  validateAll?: {
    valid: (value: T) => boolean
    message: string
  }
}

export function useSettings<T extends Object>(options: UseSettingsOptions<T>) {
  const settings = useLocalStorage<T>(options.id, options.defaultSettings)
  const afterUpdateCallbacks = ref<VoidFunction[]>([])

  const afterUpdate = (callback: VoidFunction) =>
    afterUpdateCallbacks.value.push(callback)

  watch(settings, () => {
    try {
      if (options.validateEach) {
        for (const key in options.validateEach) {
          const { valid, message } = options.validateEach[key]
          if (!valid(settings.value[key])) {
            throw new Error(message)
          }
        }
      }

      if (options.validateAll) {
        const { valid, message } = options.validateAll
        if (!valid(settings.value)) {
          throw new Error(message)
        }
      }
    } catch (error) {
      console.warn(error)
      settings.value = options.defaultSettings
    }
    afterUpdateCallbacks.value.forEach((callback) => callback())
  })

  // Auto-update settings when default settings is changed

  settings.value = {
    ...options.defaultSettings,
    ...settings.value,
  }

  for (const key in settings.value)
    if (!(key in options.defaultSettings)) delete settings.value[key]

  const editableSettings = ref<T>({ ...settings.value })

  const updateSettings = (newSettings: Partial<T>) => {
    settings.value = {
      ...settings.value,
      ...newSettings,
    }
  }

  return {
    settings,
    editableSettings,
    updateSettings,
    afterUpdate,
  }
}
