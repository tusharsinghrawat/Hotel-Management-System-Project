import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // 🔹 Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAdmin(parsedUser.role === "admin");
    }

    setLoading(false);
  }, []);

  // 🔹 Sign In
  const signIn = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: data._id,
          full_name: data.full_name,
          email: data.email,
          role: data.role,
        })
      );

      setUser({
        _id: data._id,
        full_name: data.full_name,
        email: data.email,
        role: data.role,
      });

      setIsAdmin(data.role === "admin");

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      return { error: null };
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description:
          err.response?.data?.message ||
          "Backend not reachable or invalid credentials",
      });
      return { error: err };
    }
  };

  // 🔹 Sign Up
  const signUp = async (email, password, fullName) => {
    try {
      await api.post("/auth/register", {
        full_name: fullName,
        email,
        password,
      });

      toast({
        title: "Account Created",
        description: "Please login to continue",
      });

      return { error: null };
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description:
          err.response?.data?.message ||
          "Backend not reachable or user already exists",
      });
      return { error: err };
    }
  };

  // 🔹 Sign Out
  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setIsAdmin(false);

    toast({
      title: "Signed out",
      description: "You have been logged out",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
