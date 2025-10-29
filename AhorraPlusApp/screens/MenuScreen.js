import { Text, StyleSheet, View, Button } from 'react-native'
import React, { useState } from 'react'
import LoginScreen from './LoginScreen';
import RegistroScreen from './RegistroScreen';

export default function MenuScreen() {
    const [screen, setScreen] = useState('menu');

    switch(screen){
        case 'login':
            return <LoginScreen/>
        case 'registro':
            return <RegistroScreen/>
        case 'menu':
            default:
                return(
                    <View style={styles.botonesContainer}>
                        <Text style={styles.titulo}>Menu de Screen de Ahorro+ App</Text>
                        <Button title='Login Screen' onPress={()=>setScreen('login')}/>
                        <Button title='Registro Screen' onPress={()=>setScreen('registro')}/>
                    </View>
                )
    }
}

const styles = StyleSheet.create({
  botonesContainer:{
      flex: 1,
      marginTop: 15,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 30,
      backgroundColor: '#2e2e2eff',
  },
  titulo:{
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
})