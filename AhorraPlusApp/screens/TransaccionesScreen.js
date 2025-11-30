import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 

const filtro = require('../assets/imagen/filtrar.png');
const restaurante = require('../assets/imagen/restaurante.png');
const pagoMensual = require('../assets/imagen/dolar.png');
const Gasolina = require('../assets/imagen/gasolina.png');

export default function TransaccionesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputTransaccion, setTransaccion] = useState('');
  const [inputCategoria, setInputCategoria] = useState('');
  const [inputMonto, setMonto] = useState('');

  const NotificacionDeEliminar = () => {
    Alert.alert(
      "Eliminar Transacción",
      "¿Estas seguro de eliminar esta trasacción?",
      [{ text: "Aceptar" }, { text: "Cancelar" }]
    );
  }

  const guardarDatos = () => {
    if(inputTransaccion.trim() === "" || inputMonto.trim() === "" || inputCategoria.trim() === ""){
      Alert.alert("Error en los Campos","Ingrese los datos devuelta",[{text:"Aceptar"}])
    } else {
      Alert.alert("Datos Enviados","Se enviaron Correctamente los Datos",[{text:"Aceptar", onPress: () => setModalVisible(false)}])
      setTransaccion('');
      setInputCategoria('');
      setMonto('');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.conetenedorEncabezado}>
        <Text style={styles.titulo}>Transacciones</Text>
        <Image source={filtro} style={styles.imagenFiltro}/>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContenido}>
        <TextInput style={styles.busquueda} placeholder='Buscar Transacción' />

        <View style={styles.contenedorDeTodasLasTransaccione}>
          <View style={styles.conendorTransaccion}>
            <Image source={restaurante} style={styles.imagenRestaurante} />
            <Text style={styles.textoTransaccion}>Uber Eats</Text>
            <Text style={styles.textoTransaccionCategoria}>Comida  2024-01-15</Text>
            <Text style={styles.dineroComida}>-$150.00</Text>
            <View style={styles.contenedorBotonesEliminaryEditar}>
              <TouchableOpacity style={styles.botonEditar} onPress={() => setModalVisible(true)}>
                <Text style={styles.textoEditar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botonEliminar} onPress={NotificacionDeEliminar}>
                <Text style={styles.textoEliminar}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.conendorTransaccion}>
            <Image source={pagoMensual} style={styles.imagenRestaurante} />
            <Text style={styles.textoTransaccion}>Pago Mensual</Text>
            <Text style={styles.textoTransaccionCategoria}>Salario  2024-01-14</Text>
            <Text style={styles.dineroSalario}>+$4,000.0</Text>
            <View style={styles.contenedorBotonesEliminaryEditar}>
              <TouchableOpacity style={styles.botonEditar} onPress={() => setModalVisible(true)}>
                <Text style={styles.textoEditar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botonEliminar} onPress={NotificacionDeEliminar}>
                <Text style={styles.textoEliminar}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.conendorTransaccion}>
            <Image source={Gasolina} style={styles.imagenRestaurante} />
            <Text style={styles.textoTransaccion}>Gasolina</Text>
            <Text style={styles.textoTransaccionCategoria}>Transporte 2024-01-13</Text>
            <Text style={styles.dineroComida}>-$400.00</Text>
            <View style={styles.contenedorBotonesEliminaryEditar}>
              <TouchableOpacity style={styles.botonEditar} onPress={() => setModalVisible(true)}>
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
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}> 
          <View style={styles.modalContenido}>
            <Text style={styles.editarTransaccion}>Agregar / Editar Transacción</Text>
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
              <TouchableOpacity style={[styles.botonBase, styles.botonCancelar]} onPress={() => setModalVisible(false)}>
                <Text style={styles.botonCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.botonBase, styles.botonGuardar]} onPress={guardarDatos}>
                <Text style={styles.botonGuardarTexto}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      
      <TouchableOpacity style={styles.botonAgregar} onPress={() => setModalVisible(true)}>
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
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
    textAlign: "center"
  },
  conetenedorEncabezado: {
    backgroundColor: "#ffff",
    width: "100%",
    height: "10%",
    alignItems: "center",
  },
  imagenFiltro: {
    marginTop: 35,
    width: 35,
    height: 35,
    position: "absolute",
    right: 10
  },
  scrollContenido: {
    paddingBottom: 40,
    flexGrow: 1
  },
  contenedorDeTodasLasTransaccione: {
    marginTop: 20,
    backgroundColor: "#ffffffff",
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 15,
  },
  conendorTransaccion: {
    marginBottom: 20
  },
  imagenRestaurante: {
    position: "absolute",
    width: 40,
    height: 40,
    marginTop: 20,
    marginLeft: 20
  },
  textoTransaccion: {
    fontSize: 18,
    marginTop: 20,
    marginLeft: 80,
    fontWeight: "bold"
  },
  textoTransaccionCategoria: {
    marginLeft: 80
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
    flexDirection: "row"
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
    color: "#fff"
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
  textoEliminar: {
    fontSize: 17,
    color: "#fff"
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContenido: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  editarTransaccion: {
    fontSize: 20,
    fontWeight: "bold"
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    marginTop: 20,
    width: "100%",
    borderRadius: 5
  },
  modalBotones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 40
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
  },busquueda: {
    backgroundColor: "#ffffff",
    marginHorizontal: 30,
    marginTop: 20,
    paddingHorizontal: 10, 
    height: 40,            
    borderRadius: 8,        
    borderWidth: 1,         
    borderColor: "#ccc"     
  },botonAgregar: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#72b13eff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
    elevation: 5,
  }
});

