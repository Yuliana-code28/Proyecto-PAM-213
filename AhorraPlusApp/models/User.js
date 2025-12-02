export class User {
    constructor(id, nombre, correo, telefono, fechaCreacion) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.telefono = telefono;
        this.fechaCreacion = fechaCreacion || new Date().toISOString();
    }

    static validar(nombre, correo, password) {
        if (!nombre || nombre.trim().length === 0) 
            throw new Error('El nombre es obligatorio');
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!correo || !emailRegex.test(correo)) {
            throw new Error('El formato del correo es inválido');
        }
        
        if (!password) 
            throw new Error('La contraseña es obligatoria');

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            throw new Error('La contraseña debe tener al menos 8 caracteres, incluir una mayúscula y un número');
        }

        return true;
    }
}