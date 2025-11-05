import React, {useState} from 'react'
import { Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, View, ScrollView, Switch, Alert, Platform } from 'react-native'

export default function RestablecerScreen() {
const [contraseña, setContraseña] = useState('');
const [confirmar, setConfirmar] = useState('');
const MostrarAlerta = () => {
  if (contraseña.trim() === '' || confirmar.trim() === '') {
    if (Platform.OS === 'web') {
      alert('Por favor, escribe y confirma tu nueva contraseña para continuar. ');
    } else {
      Alert.alert(
        'Atención',
        'Por favor, escribe y confirma tu nueva contraseña antes de continuar',
        [
          { text: 'cancelar' },
          { text: 'aceptar' }
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

  if (Platform.OS === 'web') {
    alert('Contraseña cambiada exitosamente !');
  } else {
    Alert.alert(
      'Acción completada',
      'Contraseña cambiada exitosamente',
      [
        { text: 'cancelar' },
        { text: 'aceptar' }
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
           <Text style={styles.title}>Restablecer contraseña</Text>

            <TextInput
             style={styles.input}
             placeholder="Nueva contraseña" 
             secureTextEntry={true} 
             value={contraseña}
             onChangeText={setContraseña} />
            <TextInput
              style={styles.input}
              placeholder="Confirma tu nueva contraseña"
              secureTextEntry={true}
              value={confirmar}
              onChangeText={setConfirmar}
            />

            <TouchableOpacity style={styles.restablecerButton} onPress={MostrarAlerta}>
              <Text style={styles.resButtonText}>Enviar</Text>
            </TouchableOpacity>

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
  restablecerButton: {
    backgroundColor: '#d8c242ff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  resButtonText: {
    color: '#000000ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recuadro:{
        backgroundColor: '#FFFFFF',
        borderRadius: 20, 
        padding: 24,
        width: '100%',
        elevation: 8,
  }
})