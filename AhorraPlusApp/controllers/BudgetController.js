import DatabaseService from "../database/DatabaseService";
import { Budget } from "../models/Budget";

export class BudgetController {
    constructor() {
        this.listeners = [];
    }

    async saveBudget(userId, monto, mes) {
        try {
            Budget.validar(monto);
            const budgetRaw = await DatabaseService.setBudget(userId, parseFloat(monto), mes);
            this.notifyListeners();
            return { success: true, budget: new Budget(budgetRaw.id, userId, budgetRaw.monto, mes) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getBudget(userId, mes) {
        try {
            const budgetRaw = await DatabaseService.getBudget(userId, mes);
            if (budgetRaw) {
                return new Budget(budgetRaw.id, budgetRaw.user_id, budgetRaw.monto, budgetRaw.mes);
            }
            return null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    addListener(callback) { this.listeners.push(callback); }
    removeListener(callback) { this.listeners = this.listeners.filter(l => l !== callback); }
    notifyListeners() { this.listeners.forEach(cb => cb()); }
}

export default new BudgetController();