export const API_URL ="https://subscription-tracker-api-v1.onrender.com"; //"http://localhost:5000" 

// Helper function to get user ID from JWT token"https://subscription-tracker-api-production-9770.up.railway.app" 
export const getUserIdFromToken = (): string | null => {
  if (typeof window === "undefined") {
    console.log('getUserIdFromToken: Running on server, returning null');
    return null;
  }
  
  const token = localStorage.getItem("token");
  console.log('getUserIdFromToken: Token from localStorage:', token ? 'exists' : 'not found');
  
  if (!token) return null;
  
  try {
    // Decode the JWT token to get the user ID
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    console.log('JWT Payload:', payload);
    
    // Try different common JWT user ID fields
    const userId = payload.userId || payload.sub || payload.id || payload.user_id;
    console.log('Extracted user ID:', userId);
    
    return userId || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const api = {
  async request(method: string, path: string, body?: any) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const headers: any = {
      "Content-Type": "application/json",
    };

    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      throw new Error("Unauthorized");
    }

    return res.json();
  },

  get(path: string) {
    return this.request("GET", path);
  },

  post(path: string, body: any) {
    return this.request("POST", path, body);
  },

  put(path: string, body: any) {
    return this.request("PUT", path, body);
  },

  delete(path: string) {
    return this.request("DELETE", path);
  },
};
