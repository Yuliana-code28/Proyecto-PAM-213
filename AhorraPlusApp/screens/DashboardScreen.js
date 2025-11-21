import React, {useState}  from 'react';
import {Text,TouchableOpacity,StatusBar,StyleSheet,View,ScrollView,Switch,Modal,TextInput,Alert,Image} from 'react-native';

const campanaIcono = require('../assets/imagen/campana.png');
const agregarIcono = require('../assets/imagen/agregar.png');
const transIcono = require('../assets/imagen/trans.png');
const pagarIcono = require('../assets/imagen/pagar.png');
const presupuestoIcono = require('../assets/imagen/presupuesto.png');
const inicio = require('../assets/imagen/casa.png');
const grafica = require('../assets/imagen/grafico.png');
const perfil = require('../assets/imagen/user.png');

export default function DashboardScreen() {

    const [modalVisible,setModalVisible] = useState(false);
    const [descripcion,setDescripcion] = useState('');
    const [monto,setMonto] = useState('');
    const [gasto, setGasto] = useState(true); //True = Gasto False = Ingreso

    const [presupuestomodalVisible,setPresupuestoModalVisible] = useState(false);
    const [montoPresupuesto,setMontoPresupuesto] =useState('');

    const botonGuardar = () => {
        if (!descripcion || !monto) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        Alert.alert('Exito',`Transacción guardada: ${descripcion} por $${monto}`);
        botonCerrar();
    };
    const botonCerrar = () => {setModalVisible(false); setDescripcion(''); setMonto(''); setGasto(true);};

    const botonGuardarPresupuesto = () => {
        if (!montoPresupuesto) {
            Alert.alert('Error', 'Por favor ingresa un monto de presupuesto');
            return;
        }

        Alert.alert('Exito',`Presupuesto mensual guardado: $${montoPresupuesto}`);
        botonCerrar();
    };
    const botonCerrarPresupuesto = () => {setPresupuestoModalVisible(false);setMontoPresupuesto('');};

    return(
        <View style={styles.main}>
        
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={botonCerrar}>
        
            <View style={styles.modalContenedor}>
          
                <View style={styles.modalVista}>
            
                    <Text style={styles.modalTitulo}>Agregar Transacción</Text>

                    <TextInput style={styles.modalInput} placeholder="Descripción" placeholderTextColor="#888" value={descripcion} onChangeText={setDescripcion}/>
                    <TextInput style={styles.modalInput} placeholder="Monto" placeholderTextColor="#888" keyboardType="numeric" value={monto} onChangeText={setMonto}/>

                    <View style={styles.switchContenedor}>
              
                        <Text style={[ styles.switchTexto, !gasto && styles.switchTextoActivoVerde]}>Ingreso</Text>
              
                        <Switch trackColor={{ false: '#DCFCE7', true: '#FEE2E2' }} thumbColor={gasto ? '#EF4444' : '#22C55E'} onValueChange={() => setGasto(!gasto)} value={gasto}/>
              
                        <Text style={[styles.switchTexto, gasto && styles.switchTextoActivoRojo]}>Gasto</Text>
                
                    </View>

                    <View style={styles.modalBotones}>
              
                        <TouchableOpacity style={[styles.botonBase, styles.botonCancelar]} onPress={botonCerrar}>
                            <Text style={styles.botonCancelarTexto}>Cancelar</Text>
                        </TouchableOpacity>
              
                        <TouchableOpacity style={[styles.botonBase, styles.botonGuardar]} onPress={botonGuardar}>
                            <Text style={styles.botonGuardarTexto}>Guardar</Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </View>

        </Modal>

        <Modal animationType="slide" transparent={true} visible={presupuestomodalVisible} onRequestClose={botonCerrarPresupuesto}>
        
        <View style={styles.modalContenedor}>

          <View style={styles.modalVista}>

            <Text style={styles.modalTitulo}>Definir Presupuesto</Text>

            <TextInput style={styles.modalInput} placeholder="Monto del presupuesto (Ej: $5000)" placeholderTextColor="#888" keyboardType="numeric" value={montoPresupuesto} onChangeText={setMontoPresupuesto}/>

            <View style={styles.modalBotones}>

              <TouchableOpacity style={[styles.botonBase, styles.botonCancelar]} onPress={botonCerrarPresupuesto}>
                <Text style={styles.botonCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.botonBase, styles.botonGuardar]} onPress={botonGuardarPresupuesto}>
                <Text style={styles.botonGuardarTexto}>Guardar</Text>
              </TouchableOpacity>

            </View>

          </View>

        </View>

        </Modal>

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
                <TouchableOpacity style={styles.accionBoton} onPress={() => setModalVisible(true)}>
                    <Image source={agregarIcono} style={styles.campanaIcono}/>
                    <Text style={styles.accionTexto}>Agregar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.accionBoton}>
                    <Image source={transIcono} style={styles.campanaIcono}/>
                    <Text style={styles.accionTexto}>Transacción</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.accionBoton}>
                    <Image source={pagarIcono} style={styles.campanaIcono}/>
                    <Text style={styles.accionTexto}>Pagar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.accionBoton} onPress={() => setPresupuestoModalVisible(true)}>
                    <Image source={presupuestoIcono} style={styles.campanaIcono}/>
                    <Text style={styles.accionTexto}>Presupuesto</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.transferencia}>
                <Text style={styles.tituloTrans}>Transacciones Recientes</Text>
                
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
    modalInput: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 16,
        backgroundColor: '#fff',
        color: '#000',
    },
    switchContenedor: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    switchTexto: {
        fontSize: 16,
        fontWeight: '500',
        marginHorizontal: 10,
        color: '#888',
    },
    switchTextoActivoVerde: {
        color: '#22C55E',
        fontWeight: 'bold',
    },
    switchTextoActivoRojo: {
        color: '#EF4444',
        fontWeight: 'bold',
    },
    modalBotones: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    botonBase: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    botonGuardar: {
        backgroundColor: '#d8c242ff', 
    },
    botonGuardarTexto: {
        color: '#000000ff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    botonCancelar: {
        backgroundColor: '#f3f4f6',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    botonCancelarTexto: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 16,
    },
});