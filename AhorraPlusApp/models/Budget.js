export class Budget {
    constructor(id, userId, monto, mes, descripcion) {
        this.id = id;
        this.userId = userId;
        this.monto = monto;
        this.mes = mes;
        this.descripcion = descripcion;
    }

    static validar(monto) {
        if (!monto || isNaN(monto) || Number(monto) <= 0) {
            throw new Error('El presupuesto debe ser positivo');
        }
        return true;
    }
}