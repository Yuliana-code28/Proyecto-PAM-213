export class User {
    constructor(id, nombre, correo, telefono, fechaCreacion) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.telefono = telefono;
        this.fechaCreacion = fechaCreacion || new Date().toISOString();
        this.foto = this.foto;
    }

    static validar(nombre, correo, password) {
        if (!nombre || nombre.trim().length === 0) 
            throw new Error('El nombre es obligatorio');
        
        if (!correo || !correo.includes('@')) 
            throw new Error('Correo invalido');
        
        if (!password) 
            throw new Error('La contraseña es obligatoria');

        // Validación para que la contraseña tenga mínimo 8 caracteres, 1 mayúscula y 1 número
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            throw new Error('La contraseña debe tener al menos 8 caracteres, incluir una mayúscula y un número');
        }

        return true;
    }
}
