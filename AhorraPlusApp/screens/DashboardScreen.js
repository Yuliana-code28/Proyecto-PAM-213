import React, {useCallback, useState}  from 'react';
import {Text,TouchableOpacity,StatusBar,StyleSheet,View,ScrollView,Modal,Image, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../contexto/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import TransactionController from '../controllers/TransactionController'; // <--- 1. Importar Controlador

const campanaIcono = require('../assets/imagen/campana.png');
const transIcono = require('../assets/imagen/cartera.webp');
const pagarIcono = require('../assets/imagen/pagar.png');

export default function DashboardScreen({ navigation }) {

    const { user } = useAuth();
    const userId = user.id;

    const [saldo, setSaldo] = useState(0);
    const [totalIngresos, setTotalIngresos] = useState(0);
    const [totalGastos, setTotalGastos] = useState(0);

    const [notificacionesVisible, setNotificacionesVisible] = useState(false);
    const [listaNotificaciones, setListaNotificaciones] = useState([]);

    useFocusEffect(
        useCallback(() => {
            const cargarDatos = async () => {
                try {
                    const stored = await AsyncStorage.getItem('user_notifications');
                    if (stored) {
                        setListaNotificaciones(JSON.parse(stored));
                    }
                } catch (e) { console.error(e);}

                if (userId) {
                    const transactions = await TransactionController.getAll(userId);
                    
                    const ingresosCalc = transactions
                        .filter(t => t.tipo === 'ingreso')
                        .reduce((sum, t) => sum + parseFloat(t.monto), 0);
                        
                    const gastosCalc = transactions
                        .filter(t => t.tipo === 'gasto')
                        .reduce((sum, t) => sum + parseFloat(t.monto), 0);

                    setTotalIngresos(ingresosCalc);
                    setTotalGastos(gastosCalc);
                    setSaldo(ingresosCalc - gastosCalc);
                }
            }
            cargarDatos();
        }, [userId])
    );

    const limpiarNotificaciones = async () => {
        setListaNotificaciones([]);
        await AsyncStorage.removeItem('user_notifications')
    }

    const formatMoney = (amount) => {
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    return(
        <View style={styles.main}>

        <Modal animationType="slide" transparent={true} visible={notificacionesVisible} onRequestClose={() => setNotificacionesVisible(false)} >
            <View style={styles.modalContenedor}>
                <View style={styles.modalVista}>
                    <Text style={styles.modalTitulo}>Notificaciones</Text>
                        
                    <ScrollView style={{maxHeight: 300, width: '100%'}}>
                        {listaNotificaciones.length === 0 ? (
                        <Text style={{textAlign:'center', color:'#777'}}>No tienes notificaciones nuevas.</Text>
                        ) : (
                        listaNotificaciones.map((notif, index) => (
                                <View key={index} style={styles.notificacionItem}>
                                        <Ionicons name="notifications-outline" size={22} color="#EF4444" style={{ marginRight: 8 }} />
                                    <View style={{flex:1}}>
                                        <Text style={styles.notificacionTexto}>{notif.text}</Text>
                                        <Text style={{fontSize: 10, color:'#999'}}>{notif.date}</Text>
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>

                    {listaNotificaciones.length > 0 && (
                        <TouchableOpacity onPress={limpiarNotificaciones} style={{marginTop: 10, marginBottom: 10}}>
                            <Text style={{color: 'red', fontWeight:'bold'}}>Borrar todas</Text>
                        </TouchableOpacity>
                    )}

                        <TouchableOpacity style={[styles.botonBase, styles.botonCancelar]} onPress={() => setNotificacionesVisible(false)}>
                            <Text style={styles.cerrarTexto}>Cerrar</Text>
                        </TouchableOpacity>
                </View>
            </View>
        </Modal>


        <ScrollView contentContainerStyle={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor='#e5dcb9ff'/>

            <View style={styles.saludo}>
                <View>
                    <Text style={styles.titlesaludo}>¡Hola, {user.nombre}!</Text>
                    <Text style={styles.bienvenida}>Bienvenido de Vuelta</Text>
                </View>

            <TouchableOpacity onPress={() => setNotificacionesVisible(true)}>
                <Image source={campanaIcono} style={styles.campanaIcono}/>
            </TouchableOpacity>

            </View>

            <View style={styles.balanceContainer}>
                <View style={styles.balanceLeft}>
                    <Text style={styles.balanceTitulo}>Saldo Total</Text>
                    <Text style={styles.balanceCantidad}>{formatMoney(saldo)}</Text>
                    
                    <View style={styles.iconRow}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="card-outline" size={28} color="#000000" />
                        </View>
                        <Text style={styles.cardSub}>Tarjeta: Gold Premium</Text>
                    </View>

                    <View style={styles.flowRow}>
                        <View>
                            <Text style={styles.flowTitle}>Ingresos</Text>
                            <Text style={styles.ingresoVerde}>+{formatMoney(totalIngresos)}</Text>
                        </View>
                        <View>
                            <Text style={styles.flowTitle}>Gastos</Text>
                            <Text style={styles.gastoRojo}>-{formatMoney(totalGastos)}</Text>
                        </View>
                    </View>
                </View>
            </View>


            <View style={styles.crudRow}>
                <TouchableOpacity style={styles.accionBoton} onPress={() => navigation.navigate('Creditos')}>
                    <Image source={transIcono} style={styles.campanaIcono}/>
                    <Text style={styles.accionTexto}>Créditos</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.accionBoton} onPress={() => navigation.navigate('Pagar')}>
                    <Image source={pagarIcono} style={styles.campanaIcono}/>
                    <Text style={styles.accionTexto}>Pagar</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.transferencia}>
                <Text style={styles.tituloTrans}>Acceso Rápido</Text>
            </View>

            <View style={styles.transZona}>
                
                <TouchableOpacity style={styles.transaccion} onPress={() => navigation.navigate('Transacciones')}>
                    <View style={[styles.transIconoContainer,{ backgroundColor: '#DCFCE7' },]}>
                         <Ionicons name="list-outline" size={22} color="#22C55E" />
                    </View>
                    <View style={styles.transDetalles}>
                        <Text style={styles.transNombre}>Ver Historial</Text>
                        <Text style={styles.transCategoria}>Todas tus transacciones</Text>
                    </View>
                    <View style={styles.transCantidadContainer}>
                         <Ionicons name="chevron-forward" size={20} color="#999" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.transaccion} onPress={() => navigation.navigate('Presupuestos')}>
                    <View style={[styles.transIconoContainer,{ backgroundColor: '#FEE2E2' },]}>
                        <Ionicons name="pie-chart-outline" size={22} color="#EF4444" />
                    </View>
                    <View style={styles.transDetalles}>
                        <Text style={styles.transNombre}>Presupuestos</Text>
                        <Text style={styles.transCategoria}>Administra tus límites</Text>
                    </View>
                    <View style={styles.transCantidadContainer}>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </View>
                </TouchableOpacity>
                
                <View style={{ alignItems: 'flex-end', marginTop: 8, marginBottom: 20 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Transacciones')}>
                        <Text style={styles.verTrans}>Ir a Transacciones</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </ScrollView>

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
    balanceContainer: {
        backgroundColor: '#000000ff',
        borderRadius: 20,
        padding: 20,
        marginHorizontal: 0, 
        marginVertical: 10,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        width:'100%',
        alignSelf:'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    balanceLeft: {
        flex: 1,
        paddingRight: 0,
    },
    balanceTitulo:{
        color:'#aaaaaaff',
        fontSize: 16,
        marginBottom: 4,
    },
    balanceCantidad:{
        fontSize: 36,
        fontWeight: 'bold',
        color: '#d8c242ff',
        marginBottom: 12,
    },
    cardSub: {
        fontSize: 16,
        color: '#555',
        marginBottom: 4,
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 4,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#d8c242ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8, 
    },
    flowRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#444',
        paddingTop: 16,
        marginTop: 10
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
        marginTop: 15
    },
    accionBoton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        width: '48%',
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
        color: '#000000ff',
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
    modalContenedor: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalVista: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        elevation: 5,
    },
    modalTitulo: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#000',
    },
    botonBase: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    botonCancelar: {
        backgroundColor: '#f3f4f6',
        borderWidth: 1,
        borderColor: '#ccc',
        width: '40%',
    },
    notificacionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },
    notificacionTexto: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    cerrarTexto: {
        color: '#000',  
        fontWeight: 'bold',
        fontSize: 16,
    }
});