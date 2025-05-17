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

export interface User {
  id: string;
  name: string;
  email: string;
}

export const auth = {
  login,
  register,
  logout,
  isAuthenticated,
  getCurrentUser,
  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userJson = localStorage.getItem('saheli_user');
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson) as User;
    } catch (e) {
      console.error('Failed to parse user data:', e);
      return null;
    }
  },
  async requestOtp(identifier: string): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });
      
      if (!response.ok) {
        throw new Error('Failed to request OTP');
      }
      
      return true;
    } catch (error) {
      console.error('Error requesting OTP:', error);
      return false;
    }
  },
  async verifyOtp(identifier: string, otp: string): Promise<User | null> {
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp })
      });
      
      if (!response.ok) {
        throw new Error('Invalid OTP');
      }
      
      const data = await response.json();
      
      if (data.user) {
        localStorage.setItem('saheli_auth_token', `otp_token_${Date.now()}`);
        localStorage.setItem('saheli_user', JSON.stringify(data.user));
        return data.user;
      }
      
      return null;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return null;
    }
  }
}

