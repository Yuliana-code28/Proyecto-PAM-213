import * as SQLite from 'expo-sqlite'

class DatabaseService {
    constructor() {
        this.db = null;
    }

    async initialize() {
        if (this.db) return;
        this.db = await SQLite.openDatabaseAsync('ahorraplus.db')

        await this.db.execAsync(`
            PRAGMA foreign_keys = ON;

       

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
                categoria TEXT NOT NULL,
                descripcion TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `);

        try {
            const tableInfo = await this.db.getAllAsync("PRAGMA table_info(presupuestos)");
            const hasCategory = tableInfo.some(col => col.name === 'categoria');

            if (!hasCategory) {
                await this.db.execAsync("ALTER TABLE presupuestos ADD COLUMN categoria TEXT NOT NULL DEFAULT 'General'");
                console.log("Migración: Se agregó la columna 'categoria' a la tabla 'presupuestos'.");
            }
        } catch (error) {
            console.error("Error de migración:", error);
        }

        console.log('Base de datos SQLIte inicializada');

    }


    async registerUser(nombre, correo, telefono, password) {
        try {
            const result = await this.db.runAsync(
                'INSERT INTO users (nombre, correo, telefono, password) VALUES (?, ?, ?, ?)',
                [nombre, correo, telefono, password]
            );
            return { id: result.lastInsertRowId, nombre, correo, fecha_creacion: new Date().toISOString() };
        } catch (error) {
            throw new Error("Error al registrar usuario: " + error.message);
        }
    }

    async loginUser(correo, password) {
        return await this.db.getFirstAsync(
            'SELECT * FROM users WHERE correo = ? AND password = ?',
            [correo, password]
        );
    }

    async updatePassword(correo, newPassword) {
        const result = await this.db.runAsync(
            'UPDATE users SET password = ? WHERE correo = ?',
            [newPassword, correo]
        );
        return result.changes > 0;
    }

    async getUserById(id) {
        return await this.db.getFirstAsync(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );
    }
    
    async findUserByCorreo(correo) {
    try {
        return await this.db.getFirstAsync(
            'SELECT * FROM users WHERE correo = ?',
            [correo]
        );
    } catch (error) {
        console.error("Error al buscar usuario por correo:", error);
        return null;
    }
    }
    async updateUserName(id, nombre) {
        try {
            const result = await this.db.runAsync(
                'UPDATE users SET nombre = ? WHERE id = ?',
                [nombre, id]
            );
            return result.changes > 0;
        } catch (error) {
            throw new Error("Error al actualizar nombre: " + error.message);
        }
    }

    async updateUserPassword(id, password) {
        try {
            const result = await this.db.runAsync(
                'UPDATE users SET password = ? WHERE id = ?',
                [password, id]
            );
            return result.changes > 0;
        } catch (error) {
            throw new Error("Error al actualizar contraseña: " + error.message);
        }
    }

    async updateUser(id, nombre, password) {
        try {
            const result = await this.db.runAsync(
                'UPDATE users SET nombre = ?, password = ? WHERE id = ? ',
                [nombre, password, id]
            );
            return result.changes > 0;
        } catch (error) {
            throw new Error("Error al actualizar usuario: " + error.message);
        }
    }

    async addTransaction(userId, monto, categoria, descripcion, tipo, fecha) {
        const result = await this.db.runAsync(
            'INSERT INTO transacciones (user_id, monto, categoria, descripcion, tipo, fecha) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, monto, categoria, descripcion, tipo, fecha]
        );
        return {
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
            [userId]
        );
    }

    async deleteTransaction(id) {
        const result = await this.db.runAsync('DELETE FROM transacciones WHERE id = ?', [id]);
        return result.changes > 0;
    }

    async updateTransaction(id, monto, categoria, descripcion, tipo, fecha) {
        try {
            const result = await this.db.runAsync(
                `UPDATE transacciones 
                 SET monto = ?, categoria = ?, descripcion = ?, tipo = ?, fecha = ?
                 WHERE id = ?`,
                [monto, categoria, descripcion, tipo, fecha, id]
            );

            console.log("Transacción actualizada:", result);

            return result.changes > 0;
        } catch (error) {
            console.error("Error al actualizar transacción:", error);
            throw error;
        }
    }

    async getFechaTransacciones(userId, fechaInicio, fechaFin) {
        return await this.db.getAllAsync(
            `SELECT * FROM transacciones 
           WHERE user_id = ? AND fecha BETWEEN ? AND ?
           ORDER BY fecha DESC`,
            [userId, fechaInicio, fechaFin]
        );
    }



    async addBudget(userId, monto, mes, categoria, descripcion) {
        const result = await this.db.runAsync(
            'INSERT INTO presupuestos (user_id, monto, mes, categoria, descripcion) VALUES (?, ?, ?, ?, ?)',
            [userId, monto, mes, categoria, descripcion]
        );
        return { id: result.lastInsertRowId, user_id: userId, monto, mes, categoria, descripcion };
    }

    async updateBudget(id, monto, mes, categoria, descripcion) {
        const result = await this.db.runAsync(
            'UPDATE presupuestos SET monto = ?, mes = ?, categoria = ?, descripcion = ? WHERE id = ?',
            [monto, mes, categoria, descripcion, id]
        );
        return result.changes > 0;
    }


    async getAllBudgets(userId) {
        return await this.db.getAllAsync(
            'SELECT * FROM presupuestos WHERE user_id = ? ORDER BY mes DESC',
            [userId]
        );
    }



    async getBudget(userId, mes) {
        return await this.db.getFirstAsync(
            'SELECT * FROM presupuestos WHERE user_id = ? AND mes = ?',
            [userId, mes]
        );
    }

    async getBudgetByCategory(userId, mes, category) {
        return await this.db.getFirstAsync(
            `SELECT * FROM presupuestos 
             WHERE user_id = ? AND mes = ? 
             AND LOWER(TRIM(categoria)) = LOWER(TRIM(?))`,
            [userId, mes, category]
        );
    }


    async deleteBudget(id) {
        const result = await this.db.runAsync('DELETE FROM presupuestos WHERE id = ?', [id]);
        return result.changes > 0;
    }

}

export default new DatabaseService();
