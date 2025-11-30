export class Transaction {
    constructor(id, userId, monto, categoria, descripcion, tipo, fecha) {
        this.id = id;
        this.userId = userId;
        this.monto = monto;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.tipo = tipo;
        this.fecha = fecha;
    }

    static validar(monto, categoria) {
        if (!monto || isNaN(monto) || Number(monto) <= 0) {
            throw new Error('El monto debe ser un número positivo');
        }
        if (!categoria || categoria.trim().length === 0) {
            throw new Error('La categoría es obligatoria');
        }
        return true;
    }
}