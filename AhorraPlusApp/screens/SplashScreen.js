import React, {useEffect} from "react"
import { View, Text, StyleSheet, Image, StatusBar, ActivityIndicator } from "react-native"

export default function SplashScreen({ navigation }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Inicio');
        },3000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#202020ff"/>

            <Image source={require('../assets/imagen/AhorraPlusApp.png')} style={styles.logo}/>

            <Text style={styles.title}>Ahorra +</Text>
            <Text style={styles.subtitle}>Tus finanzas bajo control</Text>

            <ActivityIndicator size="large" color="#e5dcb9ff" style={{marginTop: 50}}/>
        </View>
    )
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        backgroundColor: '#202020ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#e5dcb9ff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 20,
        color: '#d4d4d4ff',
        fontStyle: 'italic',
    }
})