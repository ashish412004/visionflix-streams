import { useState, useEffect } from "react"

/**
 * A custom React hook for managing local storage with SSR-safe implementation.
 * 
 * This hook safely handles client-side storage in Next.js by:
 * - Checking if window is defined (SSR safety)
 * - Using useEffect to set initial client-side values (prevents hydration mismatches)
 * - Providing type-safe storage for any serializable data
 * 
 * @template T - The type of value to store
 * @param key - The localStorage key to use
 * @param initialValue - The initial value to use if no stored value exists
 * @returns [storedValue, setValue] - A tuple similar to useState
 * 
 * @example
 * ```tsx
 * const [theme, setTheme] = useLocalStorage('theme', 'dark')
 * const [preferences, setPreferences] = useLocalStorage('user-preferences', { notifications: true })
 * ```
 */
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    try {
      // Get from local storage by key
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key)
        if (item) {
          // Parse stored json or if not json, return as string
          setStoredValue(item ? JSON.parse(item) : initialValue)
        }
      }
    } catch (error) {
      // If error, return initialValue
      console.error(`Error reading localStorage key "${key}":`, error)
      setStoredValue(initialValue)
    }
  }, [key, initialValue])

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      // Save state
      setStoredValue(valueToStore)
      
      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}

export default useLocalStorage
