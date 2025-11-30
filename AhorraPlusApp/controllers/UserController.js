import DatabaseService from "../database/DatabaseService"
import { User } from "../models/User"

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

    async login(correo, password) {
        try {
            const userRaw = await DatabaseService.loginUser(correo, password);
            if (userRaw) {
                const user = new User(userRaw.id, userRaw.nombre, userRaw.correo, userRaw.telefono, userRaw.fecha_creacion);
                return { success: true, user};
            }
            return { success: false, error: "Credenciales incorrectas"};
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message };
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
}

export default new UserController();