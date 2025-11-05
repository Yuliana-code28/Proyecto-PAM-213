import { Text, StyleSheet, View, Button } from 'react-native'
import React, { useState } from 'react'
import LoginScreen from './LoginScreen';
import RegistroScreen from './RegistroScreen';
import PantallaGraficas from './PantallaGraficas';
import TransaccionesScreen from './TransaccionesScreen';
import DashboardScreen from './DashboardScreen';
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
        case 'menu':
            default:
                return(
                    <View style={styles.botonesContainer}>
                        <Text style={styles.titulo}>Menu de Screen de Ahorro+ App</Text>
                        <Button color="#a18b1cff" title='Login Screen' onPress={()=>setScreen('login')}/>
                        <Button color="#a18b1cff" title='Registro Screen' onPress={()=>setScreen('registro')}/>
                        <Button color="#a18b1cff" title='DashBoard Screen' onPress={() => setScreen('dashboard')}/>
                        <Button color="#a18b1cff" title='Graficas Screen' onPress={()=> setScreen('graficas') }/>
                        <Button color="#a18b1cff" title='Transacciones Screen' onPress={()=> setScreen('transacciones') }/>
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