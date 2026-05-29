"use client"

import { useState } from "react"
import useLocalStorage from "@/hooks/useLocalStorage"

/**
 * UserPreferencesDemo Component
 * 
 * This component demonstrates the useLocalStorage hook by saving user preferences
 * as an object to local storage. The preferences persist across page refreshes.
 * 
 * Example usage of storing complex objects in localStorage with SSR safety.
 */
export function UserPreferencesDemo() {
  // Example: Store user preferences as an object
  const [preferences, setPreferences] = useLocalStorage<{
    theme: 'light' | 'dark'
    notifications: boolean
    language: string
  }>('user-preferences', {
    theme: 'dark',
    notifications: true,
    language: 'en'
  })

  // Example: Store a simple string value
  const [recentSearch, setRecentSearch] = useLocalStorage<string>('recent-search', '')

  const [tempSearch, setTempSearch] = useState('')

  const handleSaveSearch = () => {
    setRecentSearch(tempSearch)
    setTempSearch('')
  }

  return (
    <div className="p-4 bg-zinc-900 border border-white/10 rounded-lg space-y-4">
      <h3 className="text-lg font-bold text-white">User Preferences Demo</h3>
      
      {/* Object Storage Example */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-300">Theme Preference</h4>
        <div className="flex gap-2">
          <button
            onClick={() => setPreferences({ ...preferences, theme: 'light' })}
            className={`px-3 py-1 rounded text-sm ${preferences.theme === 'light' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Light
          </button>
          <button
            onClick={() => setPreferences({ ...preferences, theme: 'dark' })}
            className={`px-3 py-1 rounded text-sm ${preferences.theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            Dark
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-300">Notifications</h4>
        <button
          onClick={() => setPreferences({ ...preferences, notifications: !preferences.notifications })}
          className={`px-3 py-1 rounded text-sm ${preferences.notifications ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          {preferences.notifications ? 'Enabled' : 'Disabled'}
        </button>
      </div>

      {/* String Storage Example */}
      <div className="space-y-2 pt-4 border-t border-white/10">
        <h4 className="text-sm font-semibold text-gray-300">Recent Search</h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={tempSearch}
            onChange={(e) => setTempSearch(e.target.value)}
            placeholder="Enter search term..."
            className="flex-1 px-3 py-1 bg-black border border-white/20 rounded text-white text-sm"
          />
          <button
            onClick={handleSaveSearch}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Save
          </button>
        </div>
        {recentSearch && (
          <p className="text-xs text-gray-400">
            Saved: <span className="text-white">{recentSearch}</span>
          </p>
        )}
      </div>

      {/* Debug Info */}
      <div className="pt-4 border-t border-white/10">
        <p className="text-xs text-gray-500">
          Current preferences saved to localStorage:
        </p>
        <pre className="text-xs text-gray-400 mt-1 bg-black/50 p-2 rounded overflow-x-auto">
          {JSON.stringify(preferences, null, 2)}
        </pre>
      </div>
    </div>
  )
}
