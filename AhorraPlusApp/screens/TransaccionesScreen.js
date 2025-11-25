import React,{useState} from 'react'
import { Text,View,StyleSheet, Image,TouchableOpacity,ScrollView,Alert,Modal,TextInput} from 'react-native'

const flecha = require('../assets/imagen/flec.png');
const filtro = require('../assets/imagen/filtrar.png');
const busquedaImagen = require('../assets/imagen/buscar.png');
const restaurante = require('../assets/imagen/restaurante.png');
const pagoMensual = require('../assets/imagen/dolar.png')
const Gasolina = require('../assets/imagen/gasolina.png');

export default function TransaccionesScreen() {
  
  const [activoTipo, setActivoTipo] = useState('');
  const [categoria,setCategoria] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [inputTransaccion,setTransaccion] = useState('');
  const [inputCategoria,setInputCategoria] = useState('');
  const [inputMonto,setMonto] = useState();

  const NotificacionDeEliminar = ()=>{
     Alert.alert("Eliminar Transacción","¿Estas seguro de eliminar esta trasacción?",[{text:"Aceptar"},{text:"Cancelar"}]);
  }
  const guardarDatos = ()=>{
    if(inputTransaccion.trim() === "" || inputMonto === 0 || inputCategoria.trim() === ""){
      Alert.alert("Error en los Campos","Ingrese los datos devuelta",[{text:"Aceptar"}])
    }else{
       Alert.alert("Datos Envidados","Se enviaron Correctamente los Datos",[{text:"Aceptar",onPress:()=> setModalVisible(false)}])
    }
    
  }
  return (
    <View style={styles.container}>

      <View style={styles.conetenedorEncabezado}>
        
         <Text style={styles.titulo}>Transacciones</Text>
         <Image source={filtro} style={styles.imagenFiltro}/>

      <View style={styles.busqueda}>
        <Image source={busquedaImagen} style={styles.imagenBusqueda}/>
        <Text style={styles.textoBusquedaTransacciones}>Buscar transacciones...</Text>
      </View>

      <View style={styles.ContenedorDeTiposDetransacciones}>
        <Text style={styles.tipoDetransaccion}>Tipo</Text>
      <View style={styles.ContenedorBotones}>
        
        <TouchableOpacity style={[styles.botones, activoTipo === 'todas' && styles.activar ] }
        onPress={()=>setActivoTipo('todas')}>
        <Text>Todas</Text>
        </TouchableOpacity>
       
        <TouchableOpacity style={[styles.botones, activoTipo === 'ingresos' && styles.activar ] }
        onPress={()=>setActivoTipo('ingresos')}>
        <Text>Ingresos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.botones, activoTipo === 'gastos' && styles.activar ] }
        onPress={()=>setActivoTipo('gastos')}>
        <Text>Gastos</Text>
        </TouchableOpacity>

      </View>
        <Text style={styles.TextoCategoria}>Categoría</Text>
      <View style={styles.ContenedorBotones}>
       
        <TouchableOpacity style={[styles.botones, categoria === 'todas' && styles.activar]}
        onPress={()=> setCategoria('todas')}>
        <Text>Todas</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.botones, categoria === 'comida' && styles.activar]}
        onPress={()=> setCategoria('comida')}>
        <Text>Comida</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.botones, categoria === 'transporte' && styles.activar]}
        onPress={()=> setCategoria('transporte')}>
        <Text>Transporte</Text>
        </TouchableOpacity>
      
      </View>
       <View style={styles.ContenedorBotones}>
       
        <TouchableOpacity style={[styles.botonesCategoria, categoria === 'compras' && styles.activar]}
        onPress={()=> setCategoria('compras') }>
        <Text>Compras</Text>
        </TouchableOpacity>
       
        <TouchableOpacity style={[styles.botonesCategoria, categoria === 'servicios' && styles.activar]}
        onPress={()=> setCategoria('servicios') }>
        <Text>Servicios</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.botonesCategoria, categoria === 'salud' && styles.activar]}
        onPress={()=> setCategoria('salud') }>
        <Text>Salud</Text>
        </TouchableOpacity>
      
      </View> 
        <View style={styles.ContenedorBotones}>
        <TouchableOpacity style={[styles.botonesCategoria, categoria === 'entretenimiento' && styles.activar]}
        onPress={()=> setCategoria('entretenimiento') }>
        <Text>Entretenimiento</Text>
        </TouchableOpacity>
       
        <TouchableOpacity style={[styles.botonesCategoria, categoria === 'educacion' && styles.activar]}
        onPress={()=> setCategoria('educacion') }>
        <Text>Educación</Text>
        </TouchableOpacity>
        </View>      
       </View>
      </View>
    
      <ScrollView contentContainerStyle={styles.scrollContenido}>
         <View style={styles.contenedorDeTodasLasTransaccione}>
           <View style={styles.conendorTransaccion}>
              <Image source={restaurante}  style={styles.imagenRestaurante} />
              <Text style={styles.textoTransaccion}>Uber Eats</Text>
              <Text style={styles.textoTransaccionCategoria}>Comida  2024-01-15</Text>
              <Text style={styles.dineroComida}>-$150.00</Text>
            <View style={styles.contenedorBotonesEliminaryEditar}>
              <TouchableOpacity style={styles.botonEditar}
              onPress={()=>setModalVisible(true)}>
                <Text style={styles.textoEditar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botonEliminar} onPress={NotificacionDeEliminar}>
                <Text style={styles.textoEliminar}>Eliminar</Text>
              </TouchableOpacity>
            </View>
           </View>
            <View style={styles.conendorTransaccion}>
              <Image source={pagoMensual}  style={styles.imagenRestaurante} />
              <Text style={styles.textoTransaccion}>Pago Mensual</Text>
              <Text style={styles.textoTransaccionCategoria}>salario  2024-01-14</Text>
              <Text style={styles.dineroSalario}>+$4,000.0</Text>
            <View style={styles.contenedorBotonesEliminaryEditar}>
              <TouchableOpacity style={styles.botonEditar}>
                <Text style={styles.textoEditar}  onPress={()=>setModalVisible(true)}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botonEliminar} onPress={NotificacionDeEliminar}>
                <Text style={styles.textoEliminar}>Eliminar</Text>
              </TouchableOpacity>
            </View>
           </View>
           <View style={styles.conendorTransaccion}>
              <Image source={Gasolina}  style={styles.imagenRestaurante} />
              <Text style={styles.textoTransaccion}>Gasolina</Text>
              <Text style={styles.textoTransaccionCategoria}>Transporte 2024-01-13</Text>
              <Text style={styles.dineroComida}>-$400.00</Text>
            <View style={styles.contenedorBotonesEliminaryEditar}>
              <TouchableOpacity style={styles.botonEditar}  onPress={()=>setModalVisible(true)}>
                <Text style={styles.textoEditar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botonEliminar} onPress={NotificacionDeEliminar}>
                <Text style={styles.textoEliminar}>Eliminar</Text>
              </TouchableOpacity>
            </View>
           </View>
         </View>
      </ScrollView>

         
        <Modal 
        animationType='none'
        transparent={true}
        visible={modalVisible}
        onRequestClose={()=> setModalVisible(false)}>
             <View style={styles.modalContainer}> 
                <View style={styles.modalContenido}>
                   <Text style={styles.editarTransaccion}>Editar Transaccion</Text>
                   <TextInput
                    style={styles.input}
                    placeholder="Nombre de la transacción"
                    placeholderTextColor="#888"
                    value={inputTransaccion}
                    onChangeText={setTransaccion}
                    />
                   <TextInput
                    style={styles.input}
                    placeholder="Categoría transacción"
                    placeholderTextColor="#888"
                    value={inputCategoria}
                    onChangeText={setInputCategoria}
                    />
                    <TextInput
                    style={styles.input}
                    placeholder="Monto"
                    placeholderTextColor="#888"
                    keyboardType='numeric'
                    value={inputMonto}
                    onChangeText={setMonto}
                    />
                    <View style={styles.modalBotones}>
                                
                    <TouchableOpacity style={[styles.botonBase, styles.botonCancelar]} onPress={()=>setModalVisible(false)}>
                        <Text style={styles.botonCancelarTexto}>Cancelar</Text>
                     </TouchableOpacity>
                                
                    <TouchableOpacity style={[styles.botonBase, styles.botonGuardar]} onPress={guardarDatos}>
                         <Text style={styles.botonGuardarTexto}>Guardar</Text>
                    </TouchableOpacity>
                   </View>
                </View>
             </View>
        </Modal>
     </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5dcb9ff',
  },
  titulo: {
    marginTop: 35,
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  imagenFlecha: {
    marginTop: 35,
    position: "absolute",
    width: 40,
    height: 40,
    left: 10,
  },
  conetenedorEncabezado: {
    backgroundColor: "#ffff",
    width: "100%",
    height: "50%",
    alignItems: "center",
  },
  imagenFiltro: {
    marginTop: 35,
    width: 35,
    height: 35,
    position: "absolute",
    right: 10,
  },
  busqueda: {
    width: "90%",
    height: "9%",
    borderRadius: 15,
    marginTop: 35,
    backgroundColor: "#afaeae62",
  },
  imagenBusqueda: {
    width: 25,
    height: 25,
    position: "absolute",
    marginLeft: 15,
    marginTop: 5,
  },
  textoBusquedaTransacciones: {
    fontSize: 18,
    marginLeft: 60,
    marginTop: 6,
    color: "#928888ff",
  },
  ContenedorDeTiposDetransacciones: {
    width: "100%",
    marginTop: 20,
    marginLeft: 25,
  },
  tipoDetransaccion: {
    position: "absolute",
    fontSize: 19,
    fontWeight: "bold",
  },
  botones: {
    marginTop: 35,
    width: "30%",
    height: 30,
    backgroundColor: "#afaeae62",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "black",
    marginLeft: 5,
  },
  botonesCategoria: {
    marginTop: 20,
    width: "30%",
    height: 30,
    backgroundColor: "#afaeae62",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "black",
    marginLeft: 5,
  },
  activar: {
    backgroundColor: "#ffeb32ff",
  },
  TextoCategoria: {
    position: "absolute",
    marginTop: 70,
    fontWeight: "bold",
    fontSize: 18,
  },
  scrollContenido: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  contenedorDeTodasLasTransaccione: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "#ffffffff",
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 15,
  },
  conendorTransaccion: {
    marginBottom: 20,
  },
  imagenRestaurante: {
    position: "absolute",
    width: 40,
    height: 40,
    marginTop: 20,
    marginLeft: 20,
  },
  textoTransaccion: {
    fontSize: 18,
    marginTop: 20,
    marginLeft: 80,
    fontWeight: "bold",
  },
  textoTransaccionCategoria: {
    marginLeft: 80,
  },
  dineroComida: {
    position: "absolute",
    right: 20,
    marginTop: 30,
    fontSize: 20,
    color: "red",
  },
  dineroSalario: {
    position: "absolute",
    right: 20,
    marginTop: 30,
    fontSize: 20,
    color: "#9ad654ff",
  },
  contenedorBotonesEliminaryEditar: {
    flexDirection: "row",
  },
  botonEditar: {
    backgroundColor: "#72b13eff",
    width: "30%",
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    marginTop: 20,
    borderRadius: 15,
  },
  textoEditar: {
    fontSize: 18,
    color: "#fff",
  },
  botonEliminar: {
    backgroundColor: "red",
    width: "30%",
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    marginTop: 20,
    borderRadius: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContenido: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  editarTransaccion: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    marginTop: 20,
    width: "100%",
    borderRadius: 5,
  },
  modalBotones: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 40,
  },
  botonBase: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  botonGuardar: {
    backgroundColor: "#d8c242ff",
  },
  botonGuardarTexto: {
    color: "#000000ff",
    fontWeight: "bold",
    fontSize: 16,
  },
  botonCancelar: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  botonCancelarTexto: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
});
