
    import React, { createContext, useState, useContext, useEffect } from 'react';
    import { useToast } from '@/components/ui/use-toast';

    const AuthContext = createContext();

    export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [isAuthenticated, setIsAuthenticated] = useState(false);
      const { toast } = useToast();

      useEffect(() => {
        const storedUser = localStorage.getItem('aura-user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      }, []);

      const login = (email, password) => {
        // Simulate API call
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (email === 'user@example.com' && password === 'password') {
              const userData = { email, name: 'Demo User', role: 'Pro' }; // Simulate Pro user
              localStorage.setItem('aura-user', JSON.stringify(userData));
              setUser(userData);
              setIsAuthenticated(true);
              toast({ title: "Login Successful", description: "Welcome back!" });
              resolve(userData);
            } else if (email === 'free@example.com' && password === 'password') {
              const userData = { email, name: 'Free User', role: 'Free' };
              localStorage.setItem('aura-user', JSON.stringify(userData));
              setUser(userData);
              setIsAuthenticated(true);
              toast({ title: "Login Successful", description: "Welcome back!" });
              resolve(userData);
            } else if (email === 'admin@example.com' && password === 'password') {
              const userData = { email, name: 'Admin User', role: 'Admin' };
              localStorage.setItem('aura-user', JSON.stringify(userData));
              setUser(userData);
              setIsAuthenticated(true);
              toast({ title: "Login Successful", description: "Welcome back, Admin!" });
              resolve(userData);
            }
            else {
              toast({ variant: "destructive", title: "Login Failed", description: "Invalid email or password." });
              reject(new Error("Invalid credentials"));
            }
          }, 500);
        });
      };
      
      const register = (email, password) => {
        // Simulate API call for registration
        return new Promise((resolve) => {
          setTimeout(() => {
            const newUser = { email, name: "New User", role: "Free" }; // Default to Free role
            // In a real app, you'd save this to a backend and send a verification email.
            // For now, we'll just log them in.
            localStorage.setItem('aura-user', JSON.stringify(newUser));
            setUser(newUser);
            setIsAuthenticated(true);
            toast({ title: "Registration Successful", description: "Welcome to AURA GDPR!" });
            resolve(newUser);
          }, 500);
        });
      };

      const logout = () => {
        localStorage.removeItem('aura-user');
        setUser(null);
        setIsAuthenticated(false);
        toast({ title: "Logged Out", description: "You have been successfully logged out." });
      };

      return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
          {children}
        </AuthContext.Provider>
      );
    };

    export const useAuth = () => useContext(AuthContext);
  