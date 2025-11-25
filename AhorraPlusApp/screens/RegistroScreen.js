import React, {useState} from 'react'
import { Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, View, ScrollView, Switch, Alert, Platform } from 'react-native'

export default function RegistroScreen({navigation}) {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [numero, setNumero]=useState('');
    const [terminos, setTerminos] = useState(false); 
 
    const MostrarAlerta= () =>{
    if(nombre.trim() === '' || correo.trim() === '' || contraseña.trim() === '' || confirmar.trim() === '' ||numero.trim()===''){ 
      if(Platform.OS === 'web'){ 
        alert('Por favor, escribe: nombre, correo electronico, número de telefono y contraseña, para continuar. '); 
    }else{  
      Alert.alert( 
        'Atención',
        'Por favor, escribe tu nombre, correo electronico, número de telefono y contraseña antes de continuar',
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
  if(numero.length!=10){
    if(Platform.OS=== 'web'){
      alert('El número de telefono debe de contener 10 digitos.')
    }else{
      Alert.alert(
        'Error',
        'El número de telefono debe de contener 10 digitos.'
        [
          {text: 'cancelar'},
          {text: 'Aceptar'}
        ]
      );
    }
    return;
  }

  if (!correo.includes('@')) {
    if (Platform.OS === 'web') {
      alert('El correo debe contener el símbolo @');
    } else {
      Alert.alert(
        'Correo inválido',
        'El correo debe contener arroba @ ',
        [
          { text: 'Aceptar' }
        ]
      );
    }
    return;
  }

  if (contraseña !== confirmar) {
      if (Platform.OS === 'web') {
        alert('Las contraseñas no coinciden, intenta de nuevo.');
      } else {
        Alert.alert(
          'Error',
          'Las contraseñas no coinciden, intenta de nuevo.',
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
      navigation.navigate('Inicio');
  }else{
    Alert.alert(
      'Registro exitoso', `Bienvenido, ${nombre}`, 
      [
        {text: 'cancelar'},
        {text: 'aceptar',
          onPress: ()=> navigation.navigate('Inicio')
        }
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

            <TouchableOpacity style={styles.singUpButton} onPress={MostrarAlerta}>
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