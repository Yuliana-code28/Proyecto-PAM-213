import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Image, View, ActivityIndicator } from "react-native";

import UserController from "./controllers/UserController";

import LoginScreen from "./screens/LoginScreen";
import RegistroScreen from "./screens/RegistroScreen";
import DashboardScreen from "./screens/DashboardScreen";
import PerfilScreen from "./screens/PerfilScreen";
import RestablecerScreen from "./screens/RestablecerScreen";
import TransaccionesScreen from "./screens/TransaccionesScreen";
import PantallaGraficas from "./screens/PantallaGraficas";
import InicioScreen from "./screens/InicioScreen";
import PantallaGraficasIngresos from "./screens/PantallaGraficasIngresos";
import SplashScreen from "./screens/SplashScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function GraficasStack() {
   return (
      <Stack.Navigator
         initialRouteName="Graficas"
         screenOptions={{ headerShown: false }}
      >
         <Stack.Screen name="Graficas" component={PantallaGraficas}/>
         <Stack.Screen name="GraficasIngresos" component={PantallaGraficasIngresos}/>
      </Stack.Navigator>
   );
}

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#d8c24f',
      tabBarInactiveTintColor: 'gray',
      tabBarIcon: ({ focused, color, size }) => {
        let iconsource;

        if (route.name === 'Dashboard') {
          iconsource = require('./assets/imagen/casa.png');
        } else if (route.name === 'Transacciones') {
          iconsource = require('./assets/imagen/trans.png');
        } else if (route.name === 'Graficas') {
          iconsource = require('./assets/imagen/grafico.png');
        } else if (route.name === 'Perfil') {
          iconsource = require('./assets/imagen/user.png');
        }

        return (
          <Image source={iconsource} style={[styles.tabBarIcon, { width: size, height: size, tintColor: color }]} />
        );
      }
    })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Transacciones" component={TransaccionesScreen} />
      <Tab.Screen name="Graficas" component={GraficasStack} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isDBReady, setIsDBReady] = useState(false);

  useEffect(() => {
    const iniciarApp = async () => {
      try {
        console.log("Iniciando Base de Datos...");
        await UserController.initialize();
        console.log("Base de Datos Lista");
        setIsDBReady(true);
      } catch (error) {
        console.error("Error inicializando BD:", error);
      }
    };

    iniciarApp();
  }, []);

  if (!isDBReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#202020' }}>
        <ActivityIndicator size="large" color="#d8c242ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Inicio" component={InicioScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registro" component={RegistroScreen} />
        <Stack.Screen name="Restablecer" component={RestablecerScreen} />
        <Stack.Screen name="MainApp" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBarIcon: {
    resizeMode: 'contain',
    marginBottom: 4,
  }
});