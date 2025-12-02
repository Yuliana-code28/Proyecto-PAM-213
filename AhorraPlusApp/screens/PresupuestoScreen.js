import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from 'react-native';
import BudgetController from '../controllers/BudgetController';
import TransactionController from '../controllers/TransactionController';
import UserController from "../controllers/UserController";

const filtro = require('../assets/imagen/filtrar.png');
const agregarIcono = require('../assets/imagen/agregar.png');
const iconoMeta = require('../assets/imagen/meta.jpg');

export default function PresupuestoScreen() {
  const [budgets, setBudgets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [inputMes, setInputMes] = useState('');
  const [inputMonto, setMonto] = useState('');
  const [inputDescripcion, setInputDescripcion] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

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
    TransactionController.addListener(listener);
    
    return () => {
        BudgetController.removeListener(listener);
        TransactionController.removeListener(listener);
    };
  }, []);

  const fetchRecentBudgets = async (id) => {
    setLoading(true);
    const listaPresupuestos = [];
    const date = new Date();
    
    const allTransactions = await TransactionController.getAll(id);

    for (let i = -1; i < 6; i++) {
        const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
        const mesStr = d.toISOString().slice(0, 7);
        const b = await BudgetController.getBudget(id, mesStr);
        
        if (b) {
            const gastadoMes = allTransactions
                .filter(t => t.tipo === 'gasto' && t.fecha.startsWith(mesStr))
                .reduce((sum, t) => sum + t.monto, 0);
            listaPresupuestos.push({ ...b, gastado: gastadoMes });
        }
    }
    setBudgets(listaPresupuestos);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!inputMes || !inputMonto) return Alert.alert("Error", "Completa mes y monto");
    const regexMes = /^\d{4}-\d{2}$/;
    if (!regexMes.test(inputMes)) return Alert.alert("Error", "Formato YYYY-MM inválido");
    if (!userId) return;

    const result = await BudgetController.saveBudget(userId, inputMonto, inputMes, inputDescripcion);

    if (result.success) {
      Alert.alert("Éxito", "Presupuesto guardado.");
      setModalVisible(false);
      resetFields();
      fetchRecentBudgets(userId);
    } else {
      Alert.alert("Error", result.error);
    }
  };

  const handleDelete = (id) => {
      Alert.alert("Eliminar", "¿Borrar este presupuesto?", [
          { text: "Cancelar", style: "cancel" },
          { text: "Eliminar", style: "destructive", onPress: async () => {
              await BudgetController.deleteBudget(id);
              fetchRecentBudgets(userId);
          }}
      ]);
  }

  const openEdit = (b) => {
      setIsEditing(true);
      setCurrentId(b.id);
      setInputMes(b.mes);
      setMonto(b.monto.toString());
      setInputDescripcion(b.descripcion);
      setModalVisible(true);
  }

  const openNew = () => {
      setIsEditing(false);
      setInputMes(getCurrentMonth());
      setMonto('');
      setInputDescripcion('');
      setModalVisible(true);
  }

  const resetFields = () => {
    setInputMes(''); setMonto(''); setInputDescripcion('');
  };

  const getBarColor = (p) => p >= 100 ? '#EF4444' : p >= 75 ? '#F59E0B' : '#22C55E';

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
            <Text style={{textAlign: "center", marginTop: 20, color: "#555"}}>
                {loading ? "Cargando..." : "No hay presupuestos."}
            </Text>
          ) : (
            budgets.map((b, index) => {
                const porcentaje = Math.min((b.gastado / b.monto) * 100, 100);
                const color = getBarColor(porcentaje);
                
                return (
                  <View key={index} style={styles.conendorTransaccion}>

                    <View style={styles.filaSuperior}>
                        <View style={styles.iconoContenedor}>
                          <Image source={iconoMeta} style={styles.imagenRestaurante} />
                        </View>
                        
                        <View style={{flex: 1, marginLeft: 15}}>
                            <Text style={styles.textoTransaccion}>
                                {b.descripcion ? b.descripcion : "Presupuesto"}
                            </Text>
                            <Text style={styles.textoTransaccionCategoria}>Mes: {b.mes}</Text>
                        </View>
                        
                        <Text style={[styles.dineroComida, styles.dineroSalario]}>
                          ${b.monto}
                        </Text>
                    </View>

                    <View style={styles.progressContainer}>
                        <View style={styles.progressTextRow}>
                            <Text style={styles.progressText}>Gastado: ${b.gastado.toFixed(0)}</Text>
                            <Text style={styles.progressText}>{porcentaje.toFixed(0)}%</Text>
                        </View>
                        <View style={styles.barBackground}>
                            <View style={[styles.barFill, { width: `${porcentaje}%`, backgroundColor: color }]} />
                        </View>
                    </View>

                    <View style={styles.botonesAccionContainer}>
                        <TouchableOpacity style={styles.botonEditarItem} onPress={() => openEdit(b)}>
                            <Text style={styles.textoBotonAccion}>Editar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.botonEliminarItem} onPress={() => handleDelete(b.id)}>
                            <Text style={styles.textoBotonAccion}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>

                  </View>
                );
            })
          )}
        </View>
      </ScrollView>

      <Modal animationType='none' transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContenido}>
            <Text style={styles.editarTransaccion}>{isEditing ? "Editar" : "Nuevo"} Presupuesto</Text>
            
            <Text style={styles.labelInput}>Mes (YYYY-MM)</Text>
            <TextInput style={styles.input} placeholder="2025-11" placeholderTextColor="#888" value={inputMes} onChangeText={setInputMes} editable={!isEditing}/>
            
            <Text style={styles.labelInput}>Descripción</Text>
            <TextInput style={styles.input} placeholder="Ej: Comida" placeholderTextColor="#888" value={inputDescripcion} onChangeText={setInputDescripcion} />
            
            <Text style={styles.labelInput}>Monto Límite</Text>
            <TextInput style={styles.input} placeholder="Ej: 5000" placeholderTextColor="#888" keyboardType='numeric' value={inputMonto} onChangeText={setMonto} />

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

      <TouchableOpacity style={styles.accionBoton} onPress={openNew}>
        <Image source={agregarIcono} style={styles.campanaIcono} />
        <Text style={styles.accionTexto}>Nuevo</Text>
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
    alignItems: "center" 
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
    paddingBottom: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd', 
    paddingHorizontal: 15 
  },
  filaSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  imagenRestaurante: { 
    width: 40, 
    height: 40, 
    borderRadius: 20 
  },
  textoTransaccion: { 
    fontSize: 18, 
    fontWeight: "bold",
    color: '#000'
  },
  textoTransaccionCategoria: { 
    fontSize: 14, 
    color: '#555' 
  },
  dineroComida: { 
    fontSize: 20, 
    color: "red" 
  },
  dineroSalario: { 
    color: "#9ad654ff" 
  },
  progressContainer: {
    marginVertical: 10
  },
  progressTextRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 4
  },
  progressText: {
    fontSize: 12, 
    color: '#777',
    fontWeight: '600'
  },
  barBackground: {
    height: 8, 
    backgroundColor: '#eee', 
    borderRadius: 4, 
    overflow: 'hidden'
  },
  barFill: {
    height: '100%', 
    borderRadius: 4
  },
  botonesAccionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 15
  },
  botonEditarItem: {
    backgroundColor: '#72b13e', 
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center'
  },
  botonEliminarItem: {
    backgroundColor: '#ef4444',
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center'
  },
  textoBotonAccion: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
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
  labelInput: {
    alignSelf:'flex-start', 
    marginLeft: 5, 
    color: '#555', 
    fontWeight:'bold', 
    marginTop: 10 
  },
  input: { 
    borderWidth: 1, 
    borderColor: "black", 
    marginTop: 5, 
    width: "100%", 
    borderRadius: 5, 
    padding: 10, 
    marginBottom: 0 
  },
  modalBotones: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginTop: 25 
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
    backgroundColor: "#fdecea" 
  },
});