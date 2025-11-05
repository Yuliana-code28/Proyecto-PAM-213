import React, { useState } from 'react'
import { Text, StyleSheet, View, TouchableOpacity,StatusBar } from 'react-native'
import LoginScreen from './LoginScreen';
import RegistroScreen from './RegistroScreen';
import PantallaGraficas from './PantallaGraficas';
import TransaccionesScreen from './TransaccionesScreen';
import DashboardScreen from './DashboardScreen';
import PerfilScreen from './PerfilScreen';
import RestablecerScreen from './RestablecerScreen';
export default function MenuScreen() {
    
    const [screen, setScreen] = useState('menu');

    switch(screen){
        case 'login':
            return <LoginScreen/>
        case 'registro':
            return <RegistroScreen/>
        case 'graficas':
            return <PantallaGraficas/>
        case 'transacciones':
            return <TransaccionesScreen/>
        case 'dashboard':
            return <DashboardScreen/>
        case 'perfil':
            return <PerfilScreen/>
        case 'restablecer':
            return <RestablecerScreen/>
        case 'menu':
            default:
                return(
                    <View style={styles.container}>

                        <StatusBar barStyle="dark-content" backgroundColor="#e5dcb9ff" />

                        <Text style={styles.titulo}>Menú de Pantallas</Text>

                        <Text style={styles.subtitulo}>Ahorro+ App</Text>

                        <TouchableOpacity style={styles.botonMenu} onPress={() => setScreen('login')}>
                            <Text style={styles.textoBotonMenu}>Login Screen</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.botonMenu} onPress={() => setScreen('registro')}>
                            <Text style={styles.textoBotonMenu}>Registro Screen</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.botonMenu} onPress={() => setScreen('dashboard')}>
                            <Text style={styles.textoBotonMenu}>Dashboard Screen</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.botonMenu} onPress={() => setScreen('transacciones')}>
                            <Text style={styles.textoBotonMenu}>Transacciones Screen</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.botonMenu} onPress={() => setScreen('graficas')}>
                            <Text style={styles.textoBotonMenu}>Graficas Screen</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.botonMenu} onPress={() => setScreen('perfil')}>
                            <Text style={styles.textoBotonMenu}>Perfil Screen</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.botonMenu} onPress={() => setScreen('restablecer')}>
                            <Text style={styles.textoBotonMenu}>Restablecer Contraseña</Text>
                        </TouchableOpacity>
                        </View>
                )
    }
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    backgroundColor: '#e5dcb9ff',
  },
  titulo: {
    color: '#000000ff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3a3a3aff',
    fontStyle: 'italic',
    marginBottom: 30,
  },
  botonMenu: {
    backgroundColor: '#d8c242ff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
    elevation: 3,
  },
  textoBotonMenu: {
    color: '#000000ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});