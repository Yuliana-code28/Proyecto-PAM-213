import React, {useState} from 'react'
import { Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, View, ScrollView, Switch, Alert } from 'react-native'
import { useAuth } from '../contexto/AuthContext';

export default function LoginScreen({navigation}) {
    const { login } = useAuth();     
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña]= useState(''); 
    const [terminos, setTerminos] = useState(false); 
    const [recordar, setRecordar] = useState(false);

    const handleLogin = async () => {
        if (!correo || !contraseña) return Alert.alert('Error', 'Ingresa credenciales');
        if (!terminos) return Alert.alert('Atención', 'Acepta términos');

        const resultado = await login(correo, contraseña, recordar);

        if (!resultado.success) {
            Alert.alert('Error', resultado.error);
        }
    };

    return (
      <ScrollView contentContainerStyle={styles.container}>
      
        <StatusBar barStyle="dark-content" backgroundColor="#ffffffff"></StatusBar>
        <View >
          <Text style={styles.maintitle}>Ahorra +</Text>
          <Text style={styles.subtitle}>Controla tus finanzas personales</Text>
        </View>
        
        <View style={styles.recuadro}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <TextInput //input de correo
            style={styles.input}
            placeholder='Correo electronico'
            keyboardType='email-address'
            value={correo}
            onChangeText={setCorreo}
          ></TextInput>

          <TextInput //input de la contraseña
            style={styles.input}
            placeholder="Contraseña" 
            secureTextEntry={true} 
            value={contraseña}
            onChangeText={setContraseña} >
          </TextInput>

          <View style={styles.switchStyle}>
            <Text style={styles.switchText}>Aceptar términos y condiciones </Text>
            <Switch value={terminos} onValueChange={() => setTerminos(!terminos)} trackColor={{ false: "#767577", true: "#d8c242ff" }} />
          </View>

          <View style={styles.switchStyle}>
            <Text style={styles.switchText}>Recordar sesión </Text>
            <Switch value={recordar} onValueChange={setRecordar} trackColor={{ false: "#767577", true: "#d8c242ff" }}/>
          </View>
        
        <View style={styles.optionsContainer}>

          <TouchableOpacity onPress={() => navigation.navigate('Restablecer')}>
            <Text style={styles.Text}>Olvidé mi contraseña</Text>
          </TouchableOpacity>

        </View>
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      
        <View style={styles.registerContainer}>
          <Text> ¿No tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
            <Text style={styles.Text}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>

</ScrollView>
    
    );
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
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 15
  },
  optionText: {
    marginLeft: 8,
    color:"#fff",
  },
  Text: {
    color: '#000000ff',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#d8c242ff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    color: '#000000ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recuadro:{
        backgroundColor: '#FFFFFF',
        borderRadius: 20, 
        padding: 24,
        width: '100%',
        elevation: 8,
    },
  switchStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '100%',
    marginVertical: 5,
  },
  switchText: {
    color: '#000000ff'
  }
})