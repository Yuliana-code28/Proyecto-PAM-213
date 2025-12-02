import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from 'react-native';
import BudgetController from '../controllers/BudgetController';
import UserController from "../controllers/UserController";

const filtro = require('../assets/imagen/filtrar.png');
const iconoPresupuesto = require('../assets/imagen/presupuesto.png');
const agregarIcono = require('../assets/imagen/agregar.png');
const iconoMeta = require('../assets/imagen/meta.jpg');

export default function PresupuestoScreen() {
  const [budgets, setBudgets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [inputMes, setInputMes] = useState('');
  const [inputMonto, setMonto] = useState('');
  const [inputDescripcion, setInputDescripcion] = useState('');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentMonth = () => {
    const now = new Date();
    return now.toISOString().slice(0, 7);
  };

  useEffect(() => {
    const loadUser = async () => {
      const user = await UserController.getLoggedUser();
      if (user) {
        setUserId(user.id);
        fetchRecentBudgets(user.id);
      }
    };
    loadUser();

    const listener = async () => {
        const user = await UserController.getLoggedUser();
        if(user) fetchRecentBudgets(user.id);
    };
    BudgetController.addListener(listener);
    return () => BudgetController.removeListener(listener);
  }, []);

  const fetchRecentBudgets = async (id) => {
    setLoading(true);
    const listaPresupuestos = [];
    const date = new Date();
    
    for (let i = -1; i < 6; i++) {
        const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
        const mesStr = d.toISOString().slice(0, 7);
        const b = await BudgetController.getBudget(id, mesStr);
        if (b) {
            listaPresupuestos.push(b);
        }
    }
    setBudgets(listaPresupuestos);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!inputMes || !inputMonto) {
      return Alert.alert("Error", "Completa todos los campos");
    }
    
    const regexMes = /^\d{4}-\d{2}$/;
    if (!regexMes.test(inputMes)) {
        return Alert.alert("Error", "El formato del mes debe ser YYYY-MM (ej: 2025-11)");
    }

    if (!userId) return Alert.alert("Error", "Usuario no identificado");

    const result = await BudgetController.saveBudget(userId, inputMonto, inputMes, inputDescripcion);

    if (result.success) {
      Alert.alert("Éxito", "Presupuesto guardado correctamente.");
      setModalVisible(false);
      resetFields();
      fetchRecentBudgets(userId);
    } else {
      Alert.alert("Error", result.error);
    }
  };

  const openModal = () => {
      setInputMes(getCurrentMonth());
      setMonto('');
      setInputDescripcion('');
      setModalVisible(true);
  }

  const resetFields = () => {
    setInputMes('');
    setMonto('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.conetenedorEncabezado}>
        <Text style={styles.titulo}>Presupuestos</Text>
        <Image source={filtro} style={styles.imagenFiltro} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContenido}>
        
        <View style={styles.infoContainer}>
            <Text style={styles.subtitulo}>Administra tus límites mensuales</Text>
        </View>

        <View style={styles.contenedorDeTodasLasTransaccione}>
          {budgets.length === 0 ? (
            <Text style={{ textAlign: "center", marginVertical: 30, fontSize: 16, color: "#555" }}>
                {loading ? "Cargando..." : "No hay presupuestos recientes."}
            </Text>
          ) : (
            budgets.map((b, index) => (
              <View key={index} style={styles.conendorTransaccion}>
                <View style={styles.iconoContenedor}>
                  <Image source={iconoMeta} style={styles.imagenRestaurante} />
                </View>
                <Text style={styles.textoTransaccion}>Presupuesto Mensual</Text>
                <Text style={styles.textoTransaccionCategoria}>Mes: {b.mes}</Text>
                <Text style={[styles.dineroComida, styles.dineroSalario]}>
                  ${b.monto}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <Modal animationType='none' transparent={true} visible={modalVisible} onRequestClose={() => { setModalVisible(false); resetFields(); }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContenido}>
            <Text style={styles.editarTransaccion}>Definir Presupuesto</Text>
            
            <Text style={{alignSelf:'flex-start', marginLeft: 5, color: '#555', fontWeight:'bold'}}>Descripción (Opcional)</Text>
            <TextInput style={styles.input} placeholder="Ej: Comida" placeholderTextColor="#888" value={inputDescripcion} onChangeText={setInputDescripcion}/>

            <Text style={{alignSelf:'flex-start', marginLeft: 5, color: '#555', fontWeight:'bold'}}>Monto Límite</Text>
            <TextInput style={styles.input} placeholder="Ej: 5000" placeholderTextColor="#888" keyboardType='numeric' value={inputMonto} onChangeText={setMonto}/>

            <Text style={{alignSelf:'flex-start', marginLeft: 5, color: '#555', fontWeight:'bold'}}>Mes (YYYY-MM)</Text>
            <TextInput style={styles.input} placeholder="2025-11" placeholderTextColor="#888" value={inputMes} onChangeText={setInputMes}/>

            <View style={styles.modalBotones}>
              <TouchableOpacity style={[styles.botonBase, styles.botonCancelar]} onPress={() => { setModalVisible(false); resetFields(); }}>
                <Text style={styles.botonCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.botonBase, styles.botonGuardar]} onPress={handleSave}>
                <Text style={styles.botonGuardarTexto}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.accionBoton} onPress={openModal}>
        <Image source={agregarIcono} style={styles.campanaIcono} />
        <Text style={styles.accionTexto}>Agregar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#e5dcb9ff' 
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
    alignItems: "center" },
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
  infoContainer: { 
    marginTop: 20, 
    alignItems: 'center' 
},
  subtitulo: { 
    fontSize: 16, 
    color: "#555", 
    fontStyle: 'italic' 
},
  contenedorDeTodasLasTransaccione: { 
    marginTop: 20, 
    backgroundColor: "#ffffffff", 
    marginLeft: 15, 
    marginRight: 15, 
    borderRadius: 15, 
    paddingVertical: 15 
},
  conendorTransaccion: { 
    marginBottom: 20, 
    paddingBottom: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd', 
    height: 70 
},
  imagenRestaurante: { 
    position: "absolute", 
    width: 40, 
    height: 40, 
    marginTop: 1, 
    marginLeft: 1, 
    borderRadius: 20 
},
  textoTransaccion: { 
    fontSize: 18, 
    marginTop: 15, 
    marginLeft: 80, 
    fontWeight: "bold" 
},
  textoTransaccionCategoria: { 
    marginLeft: 80, 
    fontSize: 14, 
    color: '#555' 
},
  dineroComida: { 
    position: "absolute", 
    right: 20, 
    marginTop: 25, 
    fontSize: 20, 
    color: "red" 
},
  dineroSalario: { 
    color: "#9ad654ff" 
},
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
},
  modalContenido: { 
    backgroundColor: '#fff', 
    width: '85%', 
    borderRadius: 15, 
    padding: 20, 
    alignItems: 'center', 
    paddingBottom: 30 
},
  editarTransaccion: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 20 
},
  input: { 
    borderWidth: 1, 
    borderColor: "black", 
    marginTop: 5, 
    width: "100%", 
    borderRadius: 5, 
    padding: 10, 
    marginBottom: 15 
},
  modalBotones: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginTop: 20 
},
  botonBase: { 
    flex: 1, 
    paddingVertical: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginHorizontal: 5 
},
  botonGuardar: { 
    backgroundColor: '#d8c242ff' 
},
  botonGuardarTexto: { 
    color: '#000000ff', 
    fontWeight: 'bold', 
    fontSize: 16 
},
  botonCancelar: { 
    backgroundColor: '#f3f4f6', 
    borderWidth: 1, 
    borderColor: '#ccc' 
},
  botonCancelarTexto: { 
    color: '#333', 
    fontWeight: 'bold', 
    fontSize: 16 
},
  accionBoton: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    paddingVertical: 16, 
    alignItems: 'center', 
    width: '22%', 
    elevation: 4, 
    position: 'absolute', 
    bottom: 20, 
    right: 20 
},
  accionTexto: { 
    fontSize: 12, 
    color: '#333', 
    marginTop: 4 
},
  campanaIcono: { 
    width: 25, 
    height: 25, 
    resizeMode: 'contain' 
},
  iconoContenedor: { 
    width: 52, 
    height: 52, 
    borderRadius: 30, 
    justifyContent: "center", 
    alignItems: "center", 
    position: "absolute", 
    marginTop: 10, 
    marginLeft: 20, 
    backgroundColor: "#fdecea" 
},
});