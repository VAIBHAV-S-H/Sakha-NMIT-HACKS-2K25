// Mock authentication for demo purposes
const login = async (email: string, password: string) => {
  // In a real app, this would make an API call to your auth endpoint
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Store auth data in localStorage
  localStorage.setItem("saheli_auth_token", "demo_token_12345")
  localStorage.setItem(
    "saheli_user",
    JSON.stringify({
      name: "Demo User",
      email,
      id: "user_demo_123",
    }),
  )

  return { success: true }
}

const register = async (userData: { name: string; email: string; phone: string; password: string }) => {
  // In a real app, this would make an API call to your registration endpoint
  await new Promise((resolve) => setTimeout(resolve, 1200))

  // Store auth data in localStorage
  localStorage.setItem("saheli_auth_token", "demo_token_12345")
  localStorage.setItem(
    "saheli_user",
    JSON.stringify({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      id: "user_" + Date.now(),
    }),
  )

  return { success: true }
}

// Fix logout to redirect to landing page instead of login page
const logout = () => {
  localStorage.removeItem("saheli_auth_token")
  localStorage.removeItem("saheli_user")
  window.location.href = "/"
}

const isAuthenticated = () => {
  if (typeof window === "undefined") return false
  return !!localStorage.getItem("saheli_auth_token")
}

const getCurrentUser = () => {
  if (typeof window === "undefined") return null
  const userJson = localStorage.getItem("saheli_user")
  return userJson ? JSON.parse(userJson) : null
}

export const auth = {
  login,
  register,
  logout,
  isAuthenticated,
  getCurrentUser,
}

