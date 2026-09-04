import { createContext, useContext, useState } from "react";
import api from "../api/axios.js";

// Context ek "global box" hai jisme data rakh ke poore component tree ko
// bina props pass kiye access diya ja sakta hai
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // localStorage se initial state uthate hain — isse refresh pe login state bana rehta hai
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
  };

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — isse component ke andar "const { user, login } = useAuth()" likh sakte hain
export function useAuth() {
  return useContext(AuthContext);
}
