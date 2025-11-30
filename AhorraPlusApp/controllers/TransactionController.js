import DatabaseService from "../database/DatabaseService"
import { Transaction } from "../models/Transaction"

export class TransactionController {
    constructor() {
        this.listeners = [];
    }

    async getAll(userId) {
        try {
            const data = await DatabaseService.getTransactions(userId);
            return data.map(t => new Transaction(t.id, t.user_id, t.monto, t.categoria, t.descripcion, t.tipo, t.fecha));
        } catch (error) {
            console.error("Error obteniendo transacciones:", error);
            return [];
        }
    }

    async add(userId, monto, categoria, descripcion, tipo, fecha) {
        try {
            Transaction.validar(monto, categoria);

            const transRaw = await DatabaseService.addTransaction(userId, parseFloat(monto), categoria, descripcion, tipo, fecha);
            
            let alertMessage = null;
            if (tipo === 'gasto') {
                const mesActual = fecha.substring(0,7);
                const presupuesto = await DatabaseService.getBudget(userId, mesActual);

                if (presupuesto) {
                    const transacciones = await DatabaseService.getTransactions(userId);
                    const totalGastos = transacciones
                    .filter(t => t.tipo === 'gasto' && t.fecha.startsWith(mesActual))
                    .reduce((sum, t) => sum + t.monto, 0);

                    if (totalGastos > presupuesto.monto) {
                        alertMessage = `Atencion! Has excedido tu presupuesto mensual de $${presupuesto.monto}.`;
                    }
                }
            }

            this.notifyListeners();
            return { success: true, alertMessage, transaction: new Transaction(transRaw.id, transRaw.monto, categoria, descripcion, tipo, fecha) };
        } catch {
            console.error(error);
            return { success: false, error: error.message};
        }
    }

    async delete(id) {
        try {
            await DatabaseService.deleteTransaction(id);
            this.notifyListeners();
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    addListener(callback) { this.listeners.push(callback); }
    removeListener(callback) { this.listeners = this.listeners.filter(l => l !== callback); }
    notifyListeners() { this.listeners.forEach(cb => cb()); }
}

export default new TransactionController();