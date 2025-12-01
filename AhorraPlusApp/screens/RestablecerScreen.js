import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StatusBar, StyleSheet, View, ScrollView, Alert } from 'react-native';
import UserController from '../controllers/UserController';

export default function RestablecerScreen({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmar, setConfirmar] = useState('');

  const handleRestablecer = async () => {
    if (!correo.trim() || !contraseña.trim() || !confirmar.trim()) {
      Alert.alert('Atención', 'Todos los campos son obligatorios');
      return;
    }

    if (contraseña !== confirmar) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    const resultado = await UserController.recoverPassword(correo, contraseña);

    if (resultado.success) {
      Alert.alert('Éxito', 'Contraseña actualizada correctamente', [
        { text: 'Iniciar Sesión', onPress: () => navigation.navigate('Login') }
      ]);
    } else {
      Alert.alert('Error', resultado.error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#e5dcb9ff" />
      <View>
        <Text style={styles.maintitle}>Ahorra +</Text>
        <Text style={styles.subtitle}>Recupera tu acceso</Text>
      </View>
      <View style={styles.recuadro}>
        <Text style={styles.title}>Restablecer contraseña</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          value={correo}
          onChangeText={setCorreo}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Nueva contraseña"
          secureTextEntry={true}
          value={contraseña}
          onChangeText={setContraseña}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirma tu nueva contraseña"
          secureTextEntry={true}
          value={confirmar}
          onChangeText={setConfirmar}
        />

        <TouchableOpacity style={styles.restablecerButton} onPress={handleRestablecer}>
          <Text style={styles.resButtonText}>Cambiar Contraseña</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.goBack()} style={{marginTop: 15, alignItems:'center'}}>
            <Text>Cancelar</Text>
        </TouchableOpacity>
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