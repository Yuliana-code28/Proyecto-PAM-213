import React, {useState} from 'react'
import { Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, View, ScrollView, Switch, Alert, Platform } from 'react-native'

export default function RegistroScreen({navigation}) {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [terminos, setTerminos] = useState(false); 
      const MostrarAlerta= () =>{
    if(nombre.trim() === '' || correo.trim() === '' || contraseña.trim() === '' || confirmar.trim() === ''){ 
      if(Platform.OS === 'web'){ 
        alert('Por favor, escribe tu nombre, correo electronico y contraseña para continuar. '); 
    }else{  
      Alert.alert( 
        'Atención',
        'Por favor, escribe tu nombre, correo electronico y contraseña antes de continuar',
        [
          {text: 'cancelar'},
          {text: 'aceptar'}
        ]
      );
    }
    return;
  }
   if (!terminos) {
        if (Platform.OS === 'web') {
          alert('Favor de aceptar los términos y condiciones para poder continuar.');
        } else {
          Alert.alert(
            'Terminos no aceptados',
            'Favor de aceptar los términos y condiciones para poder continuar.',
            [
              { text: 'Cancelar' },
              { text: 'Aceptar' }
            ]
          );
        }
        return; 
  }
  
  if(Platform.OS === 'web'){
      alert(`Bienvenido, ${nombre} !`);
  }else{
    Alert.alert(
      'Hola', `Bienvenido, ${nombre}`, 
      [
        {text: 'cancelar'},
        {text: 'aceptar'}
      ]
    );
  }
}

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

            <TouchableOpacity style={styles.singUpButton} onPress={MostrarAlerta}>
              <Text style={styles.singUpButtonText}>Iniciar sesión</Text>
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