import React  from 'react';
import {Text,TouchableOpacity,StatusBar,StyleSheet,View,ScrollView,Switch,Image} from 'react-native';

const campanaIcono = require('../assets/imagen/campana.png')
const agregarIcono = require('../assets/imagen/agregar.png')
const transIcono = require('../assets/imagen/trans.png')
const pagarIcono = require('../assets/imagen/pagar.png')
const masIcono = require('../assets/imagen/mas.png')
const inicio = require('../assets/imagen/casa.png');
const grafica = require('../assets/imagen/grafico.png');
const perfil = require('../assets/imagen/user.png');

export default function DashboardScreen() {


    return(
        <View style={styles.main}>
        
        <ScrollView contentContainerStyle={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor='#e5dcb9ff'/>

            <View style={styles.saludo}>
                <View>
                    <Text style={styles.titlesaludo}>¡Hola, Usuario!</Text>
                    <Text style={styles.bienvenida}>Bienvenido de Vuelta</Text>
                </View>

                <TouchableOpacity>
                    <Image source={campanaIcono} style={styles.campanaIcono}/>
                </TouchableOpacity>
            </View>

            <View style={styles.balanceContainer}>
                <Text style={styles.balanceTitulo}>Balance Total</Text>
                <Text style={styles.balanceCantidad}>$15,847.32</Text>

                <View style={styles.flowRow}>
                    <View>
                        <Text style={styles.flowTitle}>Ingresos</Text>
                        <Text style={styles.ingresoVerde}>+$3,300.00</Text>
                    </View>

                    <View>
                        <Text style={styles.flowTitle}>Gastos</Text>
                        <Text style={styles.gastoRojo}>-$1,452.68</Text>
                    </View>
                </View>
            </View>

            <View style={styles.crudRow}>
                <TouchableOpacity style={styles.accionBoton}>
                    <Image source={agregarIcono} style={styles.campanaIcono}/>
                    <Text style={styles.accionTexto}>Agregar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.accionBoton}>
                    <Image source={transIcono} style={styles.campanaIcono}/>
                    <Text style={styles.accionTexto}>Transferir</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.accionBoton}>
                    <Image source={pagarIcono} style={styles.campanaIcono}/>
                    <Text style={styles.accionTexto}>Pagar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.accionBoton}>
                    <Image source={masIcono} style={styles.campanaIcono}/>
                    <Text style={styles.accionTexto}>Más</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.transferencia}>
                <Text style={styles.tituloTrans}>Transacciones Recientes</Text>
                <TouchableOpacity>
                    <Text style={styles.verTrans}>Ver todas</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.transZona}>
                <TouchableOpacity style={styles.transaccion}>
                    <View style={[styles.transIconoContainer,{ backgroundColor: '#FEE2E2' },]}>
                        <Text style={[styles.transFlecha, { color: '#EF4444' }]}>↑</Text>
                    </View>
                    <View style={styles.transDetalles}>
                        <Text style={styles.transNombre}>Uber Eats</Text>
                        <Text style={styles.transCategoria}>Comida</Text>
                    </View>
                    <View style={styles.transCantidadContainer}>
                        <Text style={styles.transCantidadRojo}>-$150.00</Text>
                        <Text style={styles.transFecha}>2025-11-03</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.transaccion}>
                    <View style={[styles.transIconoContainer,{ backgroundColor: '#DCFCE7' },]}>
                        <Text style={[styles.transFlecha, { color: '#22C55E' }]}>↓</Text>
                    </View>
                    <View style={styles.transDetalles}>
                        <Text style={styles.transNombre}>Pago mensual</Text>
                        <Text style={styles.transCategoria}>Salario</Text>
                    </View>
                    <View style={styles.transCantidadContainer}>
                        <Text style={styles.transCantidadVerde}>+$2,500.00</Text>
                        <Text style={styles.transFecha}>2025-10-31</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.transaccion}>
                    <View style={[styles.transIconoContainer,{ backgroundColor: '#FEE2E2' },]}>
                        <Text style={[styles.transFlecha, { color: '#EF4444' }]}>↑</Text>
                    </View>
                    <View style={styles.transDetalles}>
                        <Text style={styles.transNombre}>Gasolina</Text>
                        <Text style={styles.transCategoria}>Transporte</Text>
                    </View>
                    <View style={styles.transCantidadContainer}>
                        <Text style={styles.transCantidadRojo}>-$89.00</Text>
                        <Text style={styles.transFecha}>2025-10-31</Text>
                    </View>
                </TouchableOpacity>

            </View>

        </ScrollView>

            <View style={styles.contenedor3}>

                <View style={styles.TextoYIcono}>
                     <Image source={inicio} style={styles.navegacion}/>
                     <Text style={styles.TextoIcono}>Inicio</Text>
                </View>

                <View style={styles.TextoYIcono}>
                     <Image source={transIcono} style={styles.navegacion}/>
                     <Text style={styles.TextoIcono} >Transaciones</Text>
                </View>

                <View style={styles.TextoYIcono}>
                     <Image source={grafica} style={styles.navegacion}/>
                     <Text style={styles.TextoIcono}>Grafica</Text>
                </View>

                <View style={styles.TextoYIcono}>
                     <Image source={perfil} style={styles.navegacion}/>
                     <Text style={styles.TextoIcono}>Perfil</Text>
                </View>
            </View>


        </View>
    )

}

const styles = StyleSheet.create({
    main:{
        flex: 1,
        backgroundColor: '#e5dcb9ff',
    },
    container:{
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 120,
    },
    saludo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    titlesaludo:{
        fontSize: 26,
        fontWeight: 'bold',
        color: '#000000ff',
    },
    bienvenida:{
        fontSize: 16,
        color: '#000000ff',
    },
    campanaIcono:{
        width: 26,
        height: 26,
        resizeMode: 'contain',
    },
    balanceContainer:{
        backgroundColor: '#1A1A1A',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        elevation: 8,
    },
    balanceTitulo:{
        color:'#aaaaaaff',
        fontSize: 16,
        marginBottom: 4,
    },
    balanceCantidad:{
        color: '#d8c242ff',
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    flowRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#444',
        paddingTop: 16,
    },
    flowTitle: {
        color: '#AAAAAA',
        fontSize: 14,
        marginBottom: 4,
    },
    ingresoVerde: {
        color: '#22C55E',
        fontSize: 18,
        fontWeight: '600',
    },
    gastoRojo: {
        color: '#EF4444',
        fontSize: 18,
        fontWeight: '600',
    },
    crudRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    accionBoton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        width: '22%',
        elevation: 4,
    },
    accionTexto: {
        fontSize: 12,
        color: '#333',
        marginTop: 4,
    },
    transferencia: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    tituloTrans: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000ff',
    },
    verTrans: {
        color: '#d8c242ff',
        fontWeight: '600',
        fontSize: 14,
    },
    transZona: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        elevation: 4,
    },
    transaccion: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    transIconoContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    transFlecha: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    transDetalles: {
        flex: 1, 
    },
    transNombre: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000ff',
    },
    transCategoria: {
        fontSize: 14,
        color: '#777',
    },
    transCantidadContainer: {
        alignItems: 'flex-end',
    },
    transCantidadRojo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#EF4444',
    },
    transCantidadVerde: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#22C55E',
    },
    transFecha: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    contenedor3:{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        backgroundColor: '#fff',
        justifyContent: 'space-around',
        alignItems:"center",
        flexDirection:"row",
        paddingTop:15,
        paddingLeft:30,
        paddingRight:30,
        elevation: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee'
    },
    TextoYIcono:{
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    },
    TextoIcono:{
        fontSize:12,
        marginTop:5,
    },
    navegacion:{
        width:"30%",
        height:"40%",
        resizeMode:"contain"
    },
});