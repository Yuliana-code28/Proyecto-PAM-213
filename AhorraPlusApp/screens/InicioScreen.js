import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Inicio = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ahorra +</Text>
      <Text style={styles.subtitle}>Controla tus finanzas personales.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Iniciar sesión</Text> 
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.registerButton]}
        onPress={() => navigation.navigate('Registro')}
      >
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Inicio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070707eb', 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#DAA520', 
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#DAA520',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
        fontSize: 16,
        color: '#f9bf54ff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginBottom: 25,
}
});
