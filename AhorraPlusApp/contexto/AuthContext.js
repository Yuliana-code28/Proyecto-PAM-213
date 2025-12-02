import React, { createContext, useState, useContext, useEffect } from 'react';
import UserController from '../controllers/UserController';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        await UserController.initialize();
        const sessionUser = await UserController.getActiveSession();
        if (sessionUser) {
          setUser(sessionUser);
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (correo, password, recordar) => {
    const result = await UserController.login(correo, password, recordar);
    if (result.success) {
      setUser(result.user);
      return { success: true };
    }
    return result;
  };

  const register = async (nombre, correo, telefono, password) => {
      const result = await UserController.register(nombre, correo, telefono, password);
      return result;
  };

  const logout = async () => {
    await UserController.logout();
    setUser(null);
  };

  const updateProfile = async (nombre, password) => {
      if (!user) return;
      
      const result = await UserController.updateUser(user.id, nombre, password);
      if (result.success) {
          const updatedUser = { ...user, nombre: nombre }; 
          setUser(updatedUser);
          
           await UserController.login(user.correo, password, true); 
      }
      return result;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);