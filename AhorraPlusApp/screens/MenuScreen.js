import { Text, StyleSheet, View, Button } from 'react-native'
import React, { useState } from 'react'
import LoginScreen from './LoginScreen';
import RegistroScreen from './RegistroScreen';
import PantallaGraficas from './PantallaGraficas';
export default function MenuScreen() {
    const [screen, setScreen] = useState('menu');

    switch(screen){
        case 'login':
            return <LoginScreen/>
        case 'registro':
            return <RegistroScreen/>
        case 'graficas':
            return <PantallaGraficas/>
        case 'menu':
            default:
                return(
                    <View style={styles.botonesContainer}>
                        <Text style={styles.titulo}>Menu de Screen de Ahorro+ App</Text>
                        <Button color="#a18b1cff" title='Login Screen' onPress={()=>setScreen('login')}/>
                        <Button  color="#a18b1cff" title='Registro Screen' onPress={()=>setScreen('registro')}/>
                        <Button color="#a18b1cff" title='Graficas' onPress={()=> setScreen('graficas') }/>
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
      backgroundColor: '#181818ff',
  },
  titulo:{
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
})