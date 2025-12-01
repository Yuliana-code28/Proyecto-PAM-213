import DatabaseService from "../database/DatabaseService"
import { User } from "../models/User"
import AsyncStorage from '@react-native-async-storage/async-storage'

export class UserController {
    async initialize() {
        await DatabaseService.initialize();
    }

    async register(nombre, correo, telefono, password) {
        try {
            User.validar(nombre, correo, password);
            const userRaw = await DatabaseService.registerUser(nombre, correo, telefono, password);
            return { success: true, user: new User(userRaw.id, userRaw.nombre, userRaw.correo, userRaw.telefono, userRaw.fecha_creacion)}
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message };
        }
    }

    async login(correo, password, recordar = false) {
        try {
            const userRaw = await DatabaseService.loginUser(correo, password);
            if (userRaw) {
                
                const user = new User(userRaw.id, userRaw.nombre, userRaw.correo, userRaw.telefono, userRaw.fecha_creacion, userRaw.foto);

                if (recordar) {
                    await AsyncStorage.setItem('user_session', JSON.stringify(user))
                } else {
                    await AsyncStorage.removeItem('user_session');
                }
                return { success: true, user};
            }
            return { success: false, error: "Credenciales incorrectas"};
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message };
        }
    }

    async logout() {
        try {
            await AsyncStorage.removeItem('user_session');
            return true;
        } catch (error) {
            return false;
        }
    }

    async getActiveSession() {
        try {
            const jsonValue = await AsyncStorage.getItem('user_session');
            return jsonValue != null ? JSON.parse(jsonValue) : null; 
        } catch (e) {
            return null;
        }
    }

    async recoverPassword(correo, newPassword) {
        try {
            if(!newPassword || newPassword.length < 8) throw new Error("Contraseña inválida");
            const success = await DatabaseService.updatePassword(correo, newPassword);
            if (success) return { success: true};
            return { success: false, error: "Correo no encontrado" };
        } catch (error) {
            return {success: false, error: error.message};
        }
    }

    async getUser(id) {
        try {
            const userRaw = await DatabaseService.getUserById(id);
            if (userRaw) {
                return new User(userRaw.id, userRaw.nombre, userRaw.correo,userRaw.telefono, userRaw.fecha_creacion);
            }
            return null;
        } catch (error) {
            console.error("Error al obtener usuario:", error);
            return null;
        }
    }

    async updateUser(id, nombre, password, foto) {
        try {
            if (!nombre.trim() || !password.trim()) throw new Error("Nombre y contraseña requeridos");
            
            const success = await DatabaseService.updateUser(id, nombre, password, foto);
            if (success) {
                return { success: true };
            }
            return { success: false, error: "No se pudo actualizar" };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

}

export default new UserController();