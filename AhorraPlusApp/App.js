import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Image, View, ActivityIndicator, Text, StatusBar } from "react-native";

import { AuthProvider, useAuth } from "./contexto/AuthContext";

import LoginScreen from "./screens/LoginScreen";
import RegistroScreen from "./screens/RegistroScreen";
import DashboardScreen from "./screens/DashboardScreen";
import PerfilScreen from "./screens/PerfilScreen";
import RestablecerScreen from "./screens/RestablecerScreen";
import TransaccionesScreen from "./screens/TransaccionesScreen";
import PantallaGraficas from "./screens/PantallaGraficas";
import InicioScreen from "./screens/InicioScreen";
import PantallaGraficasIngresos from "./screens/PantallaGraficasIngresos";
import PagarScreen from "./screens/PagarScreen";
import CreditosScreen from "./screens/CreditosScreen";
import PresupuestoScreen from "./screens/PresupuestoScreen";
import DatabaseService from "./database/DatabaseService";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function GraficasStack() {
   return (
      <Stack.Navigator initialRouteName="Graficas" screenOptions={{ headerShown: false }}>
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
        } else if (route.name === 'Presupuestos') {
          iconsource = require('./assets/imagen/presupuesto.png');
        }
        return (
          <Image source={iconsource} style={[styles.tabBarIcon, { width: size, height: size, tintColor: color }]} />
        )
      }
    })}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />      
      <Tab.Screen name="Transacciones" component={TransaccionesScreen} />
      <Tab.Screen name="Presupuestos" component={PresupuestoScreen} />
      <Tab.Screen name="Graficas" component={GraficasStack} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

const NavigationLayout = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
          <View style={styles.splashContainer}>
              <StatusBar barStyle="light-content" backgroundColor="#202020ff"/>
              <Image source={require('./assets/imagen/AhorraPlusApp.png')} style={styles.logo}/>
              <Text style={styles.title}>Ahorra +</Text>
              <ActivityIndicator size="large" color="#e5dcb9ff" />
          </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <>
                      <Stack.Screen name="MainApp" component={MainTabs} />
                      <Stack.Screen name="Creditos" component={CreditosScreen} />
                      <Stack.Screen name="Pagar" component={PagarScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Inicio" component={InicioScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Registro" component={RegistroScreen} />
                        <Stack.Screen name="Restablecer" component={RestablecerScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};


export default function App() {

  React.useEffect(() => {
    const init = async () => {
      try {
        await DatabaseService.initialize();
        console.log("BD lista");
      } catch (error) {
        console.log("Error inicializando BD:", error);
      }
    };
    init();
  }, []);
  return (
      <AuthProvider>
          <NavigationLayout />
      </AuthProvider>
  );
}

const styles = StyleSheet.create({
  tabBarIcon: {
    resizeMode: 'contain',
    marginBottom: 4,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#202020ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d8c242ff',
    marginBottom: 10,
  },
  splashSubtitle: {
    fontSize: 20,
    color: '#d4d4d4ff',
    fontStyle: 'italic',
  }
});