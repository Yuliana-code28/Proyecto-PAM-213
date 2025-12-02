import DatabaseService from "../database/DatabaseService";
import { Transaction } from "../models/Transaction";

export class TransactionController {
  constructor() {
    this.listeners = [];
  }

  async getAll(userId) {
    if (!userId) return [];
    try {
      const data = await DatabaseService.getTransactions(userId);
      return data.map(
        (t) =>
          new Transaction(
            t.id,
            t.user_id,
            t.monto,
            t.categoria,
            t.descripcion,
            t.tipo,
            t.fecha
          )
      );
    } catch (error) {
      console.error("Error obteniendo transacciones:", error);
      return [];
    }
  }

  async add(userId, monto, categoria, descripcion, tipo, fecha) {
    if (!userId) throw new Error("Usuario no identificado");
    try {
      Transaction.validar(monto, categoria);

      const transRaw = await DatabaseService.addTransaction(
        userId,
        parseFloat(monto),
        categoria,
        descripcion,
        tipo,
        fecha
      );

      let alertMessage = null;

      if (tipo === "gasto") {
        const mesActual = fecha.substring(0, 7);
        const presupuesto = await DatabaseService.getBudget(userId, mesActual);

        if (presupuesto) {
          const transacciones = await DatabaseService.getTransactions(userId);
          const totalGastos = transacciones
            .filter((t) => t.tipo === "gasto" && t.fecha.startsWith(mesActual))
            .reduce((sum, t) => sum + t.monto, 0);

          if (totalGastos > presupuesto.monto) {
            alertMessage = `¡Atención! Has excedido tu presupuesto mensual de $${presupuesto.monto}.`;
          }
        }
      }

      this.notifyListeners("added");

      return {
        success: true,
        alertMessage,
        transaction: new Transaction(
          transRaw.id,
          userId,
          transRaw.monto,
          transRaw.categoria,
          transRaw.descripcion,
          transRaw.tipo,
          transRaw.fecha
        ),
      };
    } catch (error) {
      console.error("Error al agregar transacción:", error);
      return { success: false, error: error.message };
    }
  }

  async updateTransaction(id, userId, monto, categoria, descripcion, tipo, fecha) {
    if (!userId) throw new Error("Usuario no identificado");
  
    try {
        const result = await DatabaseService.updateTransaction(
            id,
            parseFloat(monto), 
            categoria,         
            descripcion,       
            tipo,              
            fecha              
        );
  
        if (!result) throw new Error("No se pudo actualizar la transacción");
  
        this.notifyListeners("updated");
  
        return new Transaction(id, userId, monto, categoria, descripcion, tipo, fecha);
    } catch (error) {
        console.error("Error al actualizar transacción:", error);
        return null;
    }
  }

  async delete(id, userId) {
    if (!userId) throw new Error("Usuario no identificado");
    try {
      const result = await DatabaseService.deleteTransaction(id, userId);
      this.notifyListeners("deleted");
      return result;
    } catch (error) {
      console.error("Error al eliminar transacción:", error);
      return false;
    }
  }

  async getFecha(userId, fechaInicio, fechaFin) {
    return await DatabaseService.getFechaTransacciones(userId, fechaInicio, fechaFin);
  }

  addListener(callback) {
    this.listeners.push(callback);
  }
  
  removeListener(callback) {
    this.listeners = this.listeners.filter((l) => l !== callback);
  }

  notifyListeners(eventType) {
    this.listeners.forEach((callback) => callback(eventType));
  }
}

export default new TransactionController();
