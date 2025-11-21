import React from "react";
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StyleSheet, Image } from "react-native"

import LoginScreen from "./screens/LoginScreen"
import RegistroScreen from "./screens/RegistroScreen"
import DashboardScreen from "./screens/DashboardScreen"
import PerfilScreen from "./screens/PerfilScreen"
import RestablecerScreen from "./screens/RestablecerScreen"
import TransaccionesScreen from "./screens/TransaccionesScreen"
import PantallaGraficas from "./screens/PantallaGraficas"

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function MainTabs() {
  return (
    <Tab.Navigator screenOptions= {({route}) => ({
      headerShown: false,
      tabBarActiveTintColor: '#d8c24ff',
      tabBarInactiveTintColor: 'gray',
      tabBarIcon: ({focused, color, size }) => {
        let iconsource;

        if (route.name === 'Dashboard') {
          iconsource = require('./assets/imagen/casa.png')
        } else if (route.name === 'Transacciones') {
          iconsource = require('./assets/imagen/trans.png')
        } else if (route.name === 'Graficas') {
          iconsource = require('./assets/imagen/grafico.png')
        }else if (route.name === 'Perfil') {
          iconsource = require('./assets/imagen/user.png')
        }

        return (
          <Image source={iconsource} style={[styles.tabBarIcon, { width: size, height: size, tintColor: color }]}/>
        )
      }

    })}>

      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Transacciones" component={TransaccionesScreen} />
      <Tab.Screen name="Graficas" component={PantallaGraficas} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />

    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registro" component={RegistroScreen} />
        <Stack.Screen name="Restablecer" component={RestablecerScreen} />
        <Stack.Screen name="MainApp" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  tabBarIcon: {
    resizeMode: 'contain',
    marginBottom: 4,
  }
})