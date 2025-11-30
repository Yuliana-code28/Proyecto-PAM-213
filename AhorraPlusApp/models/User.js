export class User {
    constructor(id, nombre, correo, telefono, fechaCreacion) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.telefono = telefono;
        this.fechaCreacion = fechaCreacion || new Date().toISOString();
    }

    static validar(nombre, correo, password) {
        if (!nombre || nombre.trim().length === 0) throw new Error('El nombre es obligatorio');
        if (!correo || !correo.includes('@')) throw new Error('Correo invalido');
        if (!password || password.length < 8) throw new Error('La contraseña es muy corta');
        return true;
    }
}