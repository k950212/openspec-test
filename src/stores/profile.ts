import { reactive, watch } from 'vue'
import { defineStore } from 'pinia'

type ProfileState = {
  name: string
  phone: string
  address: string
  email: string
}

const PROFILE_STORAGE_KEY = 'atelier-member-profile'

const defaultProfile: ProfileState = {
  name: '示範會員',
  phone: '0912-345-678',
  address: '台北市信義區松智路 1 號',
  email: 'demo@example.com',
}

function loadStoredProfile() {
  if (typeof window === 'undefined') {
    return { ...defaultProfile }
  }

  const rawValue = window.localStorage.getItem(PROFILE_STORAGE_KEY)

  if (!rawValue) {
    return { ...defaultProfile }
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<ProfileState>

    return {
      name: typeof parsedValue.name === 'string' ? parsedValue.name : defaultProfile.name,
      phone: typeof parsedValue.phone === 'string' ? parsedValue.phone : defaultProfile.phone,
      address:
        typeof parsedValue.address === 'string' ? parsedValue.address : defaultProfile.address,
      email: typeof parsedValue.email === 'string' ? parsedValue.email : defaultProfile.email,
    }
  } catch {
    return { ...defaultProfile }
  }
}

export const useProfileStore = defineStore('profile', () => {
  const profile = reactive(loadStoredProfile())

  if (typeof window !== 'undefined') {
    watch(
      () => ({ ...profile }),
      (nextProfile) => {
        window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile))
      },
      { deep: true },
    )
  }

  function updateProfile(nextProfile: Pick<ProfileState, 'name' | 'phone' | 'address'>) {
    profile.name = nextProfile.name.trim()
    profile.phone = nextProfile.phone.trim()
    profile.address = nextProfile.address.trim()
  }

  return {
    profile,
    updateProfile,
  }
})
