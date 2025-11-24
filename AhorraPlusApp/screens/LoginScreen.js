import React, {useState} from 'react'
import { Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, View, ScrollView, Switch, Alert, Platform } from 'react-native'
export default function LoginScreen({navigation}) {
    const [correo, setCorreo] = useState('');
    const[contraseña, setContraseña]= useState(''); 
    const [terminos, setTerminos] = useState(false); 

  const MostrarAlerta = () => {
    if (correo.trim() === '' || contraseña.trim() === '') {
      if (Platform.OS === 'web') {
        alert('Por favor, escribe tu correo electrónico y contraseña para continuar.');
      } else {
        Alert.alert(
          'Error',
          'Por favor, escribe tu correo electrónico y contraseña para continuar.',
          [
            { text: 'Cancelar' },
            { text: 'Aceptar' }
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

    if (Platform.OS === 'web') {
      alert(`Bienvenido, ${correo}`);
      navigation.replace('MainApp');
    } else {
      Alert.alert(
        'Iniciar sesión exitoso',
        `Bienvenido, ${correo}`,
        [
          { text: 'Cancelar' },
          { text: 'Aceptar',
            onPress: () => navigation.replace('MainApp')
           }
        ]
      );
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
            <Switch value={terminos} onValueChange={() => setTerminos(!terminos)} />
          </View>
        
        <View style={styles.optionsContainer}>

        <TouchableOpacity onPress={() => navigation.navigate('Restablecer')}>
          <Text style={styles.Text}>Olvidé mi contraseña</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={MostrarAlerta}>
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
    backgroundColor: '#ffffff20',
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