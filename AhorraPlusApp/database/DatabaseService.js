import * as SQLite from 'expo-sqlite'

class DatabaseService {
    constructor() {
        this.db = null;
    }

    async initialize() {
        this.db = await SQLite.openDatabaseAsync('ahorraplus.db')

        await this.db.execAsync(`
            PRAGMA foreing_keys = ON;

            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                correo TEXT NOT NULL UNIQUE,
                telefono TEXT,
                password TEXT NOT NULL,
                fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS transacciones (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                monto REAL NOT NULL,
                categoria TEXT,
                descripcion TEXT,
                tipo TEXT,
                fecha TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS presupuestos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                monto REAL NOT NULL,
                mes TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );

        `);
        
        console.log('Base de datos SQLIte inicializada');
    
    }

    // Seccion de Usuarios

    async registerUser(nombre, correo, telefono, password) {
        try {
            const result = await this.db.runAsync(
                'INSERT INTO users (nombre, correo, telefono, password, foto) VALUES (?, ?, ?, ?, ?)',
                nombre, correo, telefono, password, null
            );
            return {id: result.lastInsertRowId, nombre, correo, foto: null, fecha_creacion: new Date().toISOString() };
        } catch (error) {
            throw new Error("Error al registrar usuario: " + error.message);
        }
    }

    async loginUser(correo, password) {
        return await this.db.getFirstAsync(
            'SELECT * FROM users WHERE correo = ? AND password = ?',
            correo,password
        );
    }

    async updatePassword(correo, newPassword) {
        const result = await this.db.runAsync(
            'UPDATE users SET password = ? WHERE correo = ?',
            newPassword, correo
        );
        return result.changes > 0;
    }

    async getUserById(id) {
        return await this.db.getFirstAsync(
            'SELECT * FROM users WHERE id = ?',
            id
        );
    }

    async updateUser(id, nombre, password, foto) {
        try {
            const result = await this.db.runAsync(
                'UPDATE users SET nombre = ?, password = ?, foto = ? WHERE id = ? ',
                nombre, password, foto, id
            );
            return result.changes > 0;
        } catch (error){
            throw new Error("Error al actualizar usuario: " + error.message);
        }
    }

    // Seccion de Transacciones

    async addTransaction(userId, monto, categoria, descripcion, tipo, fecha) {
        const result = await this.db.runAsync(
            'INSERT INTO transacciones (user_id, monto, categoria, descripcion, tipo, fecha) VALUES (?, ?, ?, ?, ?, ?)',
            userId, monto, categoria, descripcion, tipo, fecha
        );
        return{
            id: result.lastInsertRowId,
            user_id: userId,
            monto,
            categoria,
            descripcion,
            tipo,
            fecha
        };
    }

    async getTransactions(userId) {
        return await this.db.getAllAsync(
            'SELECT * FROM transacciones WHERE user_id = ? ORDER BY fecha DESC',
            userId 
        );
    }

    async deleteTransaction(id) {
        const result = await this.db.runAsync('DELETE FROM transacciones WHERE id = ?', id);
        return result.changes > 0;
    }

    async updateTransaction(id, monto, categoria, descripcion, fecha) {
        const result = await this.db.runAsync(
            'UPDATE transacciones SET monto = ?, categoria = ?, descripcion = ?, fecha = ? WHERE id =?',
            monto, categoria, descripcion, fecha, id
        );
        return result.changes > 0;
    }

    // Seccion de Presupuestos

    async setBudget(userId, monto, mes) {
        const existing = await this.db.getFirstAsync(
            'SELECT * FROM presupuesto WHERE user_id = ? AND mes = ?',
            userId, mes
        );

        if (existing) {
            await this.db.runAsync('UPDATE presupuesto SET monto = ? WHERE id = ?', monto, existing.id);
            return { id: existing.id, user_id: userId, monto, mes};
        } else {
            const result = await this.db.runAsync(
                'INSERT INTO presupuestos (user_id, monto, mes) VALUES (?, ?, ?)',
                userId, monto, mes
            );
            return { id: result.lastInsertRowId, user_id: userId, monto, mes};
        }
    }

    async getBudget(userId, mes) {
        return await this.db.getFirstAsync(
            'SELECT *FROM presupuesto WHERE user_id = ? AND mes = ?',
            userId, mes 
        );
    }
}

export default new DatabaseService();