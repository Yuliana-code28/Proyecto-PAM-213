import React, {useState} from 'react'
import { Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, View, ScrollView, Switch, Alert, Platform } from 'react-native'
import UserController from '../controllers/UserController'

export default function RegistroScreen({navigation}) {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [numero, setNumero]=useState('');
    const [terminos, setTerminos] = useState(false);
    
    React.useEffect(() => {
      UserController.initialize();
    }, []);
 
    const handleRegistro = async () => {
      if (!nombre.trim() || !correo.trim() || !contraseña.trim() || !numero.trim()) {
        Alert.alert('Atención','Todos los campos son obligatorios');
        return;
      }
      if (!terminos) {
        Alert.alert('Atención','Debes aceptar los términos');
        return;
      }
      if (contraseña !== confirmar) {
        Alert.alert('Error','Las contraseñas no coinciden');
        return;
      }

      const resultado = await UserController.register(nombre, correo, numero, contraseña);

      if (resultado.success) {
        Alert.alert('Exito',`Bienvenido, ${resultado.user.nombre}`, [
          {text: 'Ir al Login', onPress: () => navigation.navigate('Login')}
        ]);
      } else {
        Alert.alert('Error al registrar', resultado.error);
      }
    };

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffffff"></StatusBar>
          <View>
            <Text style={styles.maintitle}>Ahorra +</Text>
            <Text style={styles.subtitle}>Controla tus finanzas personales</Text>
          </View>
         <View style={styles.recuadro}>
           <Text style={styles.title}>Registrarse</Text>
           <TextInput 
            style={styles.input}
            placeholder="Escribe tu nombre" 
            value={nombre}
            onChangeText={setNombre} 
            />
  
            <TextInput //input de numero de telefono
            style={styles.input}
            placeholder='Número de telefono'
            value={numero}
            onChangeText={setNumero}
            keyboardType='numeric'
            />

            <TextInput //input de correo
              style={styles.input}
              placeholder='Correo electronico'
              keyboardType='email-address'
              value={correo}
              onChangeText={setCorreo}
            />
            <TextInput
             style={styles.input}
             placeholder="Contraseña" 
             secureTextEntry={true} 
             value={contraseña}
             onChangeText={setContraseña} />
            <TextInput
              style={styles.input}
              placeholder="Confirma tu contraseña"
              secureTextEntry={true}
              value={confirmar}
              onChangeText={setConfirmar}
            />
            <View style={styles.switchStyle}>
              <Text style={styles.switchText}>Aceptar términos y condiciones </Text>
              <Switch value={terminos} onValueChange={() => setTerminos(!terminos)} />
            </View>

            <TouchableOpacity style={styles.singUpButton} onPress={handleRegistro}>
              <Text style={styles.singUpButtonText}>Registrarse</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text>¿Ya tienes cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.Text}>Inicia sesión</Text>
              </TouchableOpacity>
            </View>
         </View>
      </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#e5dcb9ff',
    paddingTop: 50, 
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: "#000000ff"
  },
  maintitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: "#000000ff"
  },
  subtitle: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginBottom: 12,
    },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Text: {
    color: '#000000ff',
    fontWeight: '600',
  },
  singUpButton: {
    backgroundColor: '#d8c242ff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  singUpButtonText: {
    color: '#000000ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff20',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '100%',
    marginVertical: 5,
  },
  switchText: {
    color: '#000000ff'
  },
  recuadro:{
        backgroundColor: '#FFFFFF',
        borderRadius: 20, 
        padding: 24,
        width: '100%',
        elevation: 8,
  }
})