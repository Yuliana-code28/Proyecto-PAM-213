import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Modal, TextInput, Switch } from 'react-native';
import TransactionController from '../controllers/TransactionController';
import { MaterialIcons } from '@expo/vector-icons';
import UserController from "../controllers/UserController";

const filtro = require('../assets/imagen/filtrar.png');
const iconoGasto = require('../assets/imagen/gastos3.png');
const iconoIngreso = require('../assets/imagen/ingresos2.png');
const agregarIcono = require('../assets/imagen/agregar.png');

export default function TransaccionesScreen() {
  const [transactions, setTransactions] = useState([]);
  const [modalVisibleAdd, setModalVisibleAdd] = useState(false);
  const [modalVisibleEdit, setModalVisibleEdit] = useState(false);
  const [inputTransaccion, setTransaccion] = useState('');
  const [inputCategoria, setInputCategoria] = useState('');
  const [inputMonto, setMonto] = useState('');
  const [esGasto, setEsGasto] = useState(true);
  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [userId, setUserId] = useState(null);

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const transaccionesFiltradas = transactions.filter((t) => {
    if (filtroTipo !== "todos" && t.tipo !== filtroTipo) return false;
    if (textoBusqueda.trim() !== "") {
      const texto = textoBusqueda.toLowerCase();
      const coincideDescripcion = (t.descripcion || "").toLowerCase().includes(texto);
      const coincideCategoria = (t.categoria || "").toLowerCase().includes(texto);
      if (!coincideDescripcion && !coincideCategoria) return false;
    }
    return true;
  });

  useEffect(() => {
    const loadUser = async () => {
      const user = await UserController.getLoggedUser();
      if (user) setUserId(user.id);
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchTransactions = async () => {
      const data = await TransactionController.getAll(userId);
      setTransactions(data);
    };

    fetchTransactions();

    const listener = async () => fetchTransactions();
    TransactionController.addListener(listener);
    return () => TransactionController.removeListener(listener);
  }, [userId]);

  const tipodeicono = (tipo) => {
    if (tipo === 'gasto') return iconoGasto;
    if (tipo === 'ingreso') return iconoIngreso;
    return iconoGasto;
  }

  const handleDelete = async (id) => {
    if (!userId) return Alert.alert("Error", "Usuario no identificado");

    Alert.alert(
      "Eliminar Transacción",
      "¿Estás seguro de eliminar esta transacción?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Aceptar", onPress: async () => await TransactionController.delete(id, userId) }
      ]
    );
  };

  const handleAdd = async () => {
    if (!inputTransaccion || !inputCategoria || !inputMonto) {
      return Alert.alert("Error", "Completa todos los campos");
    }
    if (!userId) return Alert.alert("Error", "Usuario no identificado");

    const tipo = esGasto ? 'gasto' : 'ingreso';
    const monto = parseFloat(inputMonto);
    const fecha = new Date().toISOString().split('T')[0];

    const result = await TransactionController.add(userId, monto, inputCategoria, inputTransaccion, tipo, fecha);

    if (result.success) {
      if (result.alertMessage) Alert.alert("Aviso", result.alertMessage);
      setModalVisibleAdd(false);
      resetFields();
    } else {
      Alert.alert("Error", result.error);
    }
  };

  const handleEdit = async () => {
    if (!inputTransaccion || !inputCategoria || !inputMonto) {
      return Alert.alert("Error", "Completa todos los campos");
    }
    if (!userId) return Alert.alert("Error", "Usuario no identificado");

    const tipo = esGasto ? 'gasto' : 'ingreso';
    const monto = parseFloat(inputMonto);
    const fecha = new Date().toISOString().split('T')[0];

    const result = await TransactionController.updateTransaction(transactionToEdit.id, userId, monto, inputCategoria, inputTransaccion, tipo, fecha);

    if (result) {
      Alert.alert("Éxito", "Transacción actualizada correctamente.");
      setModalVisibleEdit(false);
      resetFields();
    } else {
      Alert.alert("Error", "No se pudo actualizar la transacción.");
    }
  };

  const handleEditModal = (transaction) => {
    setTransactionToEdit(transaction);
    setTransaccion(transaction.descripcion);
    setInputCategoria(transaction.categoria);
    setMonto(transaction.monto.toString());
    setEsGasto(transaction.tipo === 'gasto');
    setModalVisibleEdit(true);
  };

  const resetFields = () => {
    setTransaccion('');
    setInputCategoria('');
    setMonto('');
    setEsGasto(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.conetenedorEncabezado}>
        <Text style={styles.titulo}>Transacciones</Text>
        <Image source={filtro} style={styles.imagenFiltro} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContenido}>
        <TextInput
          style={styles.busquueda}
          value={textoBusqueda}
          placeholder='Buscar Transacción'
          onChangeText={setTextoBusqueda}
        />

        <View style={styles.contenedorFiltrosTipo}>
          <TouchableOpacity style={[styles.botonFiltro, filtroTipo === "todos" && styles.botonActivo]} onPress={() => setFiltroTipo("todos")}>
            <Text style={styles.textoBoton}>Todos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.botonFiltro, filtroTipo === "gasto" && styles.botonActivo]} onPress={() => setFiltroTipo("gasto")}>
            <Text style={styles.textoBoton}>Gastos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.botonFiltro, filtroTipo === "ingreso" && styles.botonActivo]} onPress={() => setFiltroTipo("ingreso")}>
            <Text style={styles.textoBoton}>Ingresos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contenedorDeTodasLasTransaccione}>
          {transaccionesFiltradas.length === 0 ? (
            <Text style={{ textAlign: "center", marginVertical: 30, fontSize: 16, color: "#555" }}>No hay transacciones registradas.</Text>
          ) : (
            transaccionesFiltradas.map((t) => (
              <View key={t.id} style={styles.conendorTransaccion}>
                <View style={styles.iconoContenedor}>
                  <Image source={tipodeicono(t.tipo)} style={styles.imagenRestaurante} />
                </View>
                <Text style={styles.textoTransaccion}>{t.descripcion || t.categoria}</Text>
                <Text style={styles.textoTransaccionCategoria}>{t.categoria} {t.fecha}</Text>
                <Text style={[styles.dineroComida, t.tipo === 'ingreso' && styles.dineroSalario]}>
                  {t.tipo === 'gasto' ? `-$${t.monto}` : `+$${t.monto}`}
                </Text>
                <View style={styles.contenedorBotonesEliminaryEditar}>
                  <TouchableOpacity style={styles.botonEditar} onPress={() => handleEditModal(t)}>
                    <Text style={styles.textoEditar}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.botonEliminar} onPress={() => handleDelete(t.id)}>
                    <Text style={styles.textoEliminar}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Modal Agregar */}
      <Modal animationType='none' transparent={true} visible={modalVisibleAdd} onRequestClose={() => { setModalVisibleAdd(false); resetFields(); }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContenido}>
            <Text style={styles.editarTransaccion}>Agregar Transacción</Text>
            <TextInput style={styles.input} placeholder="Nombre de la transacción" placeholderTextColor="#888" value={inputTransaccion} onChangeText={setTransaccion} />
            <TextInput style={styles.input} placeholder="Categoría" placeholderTextColor="#888" value={inputCategoria} onChangeText={setInputCategoria} />
            <TextInput style={styles.input} placeholder="Monto" placeholderTextColor="#888" keyboardType='numeric' value={inputMonto} onChangeText={setMonto} />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, marginBottom: 20 }}>
              <Text style={{ marginRight: 10 }}>Gasto</Text>
              <Switch value={!esGasto} onValueChange={() => setEsGasto(!esGasto)} />
              <Text style={{ marginLeft: 10 }}>Ingreso</Text>
            </View>
            <View style={styles.modalBotones}>
              <TouchableOpacity style={[styles.botonBase, styles.botonCancelar]} onPress={() => { setModalVisibleAdd(false); resetFields(); }}>
                <Text style={styles.botonCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.botonBase, styles.botonGuardar]} onPress={handleAdd}>
                <Text style={styles.botonGuardarTexto}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Editar */}
      <Modal animationType='none' transparent={true} visible={modalVisibleEdit} onRequestClose={() => { setModalVisibleEdit(false); resetFields(); }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContenido}>
            <Text style={styles.editarTransaccion}>Editar Transacción</Text>
            <TextInput style={styles.input} placeholder="Nombre de la transacción" placeholderTextColor="#888" value={inputTransaccion} onChangeText={setTransaccion} />
            <TextInput style={styles.input} placeholder="Categoría" placeholderTextColor="#888" value={inputCategoria} onChangeText={setInputCategoria} />
            <TextInput style={styles.input} placeholder="Monto" placeholderTextColor="#888" keyboardType='numeric' value={inputMonto} onChangeText={setMonto} />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15, marginBottom: 20 }}>
              <Text style={{ marginRight: 10 }}>Gasto</Text>
              <Switch value={!esGasto} onValueChange={() => setEsGasto(!esGasto)} />
              <Text style={{ marginLeft: 10 }}>Ingreso</Text>
            </View>
            <View style={styles.modalBotones}>
              <TouchableOpacity style={[styles.botonBase, styles.botonCancelar]} onPress={() => { setModalVisibleEdit(false); resetFields(); }}>
                <Text style={styles.botonCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.botonBase, styles.botonGuardar]} onPress={handleEdit}>
                <Text style={styles.botonGuardarTexto}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.accionBoton} onPress={() => { setModalVisibleAdd(true); resetFields(); }}>
        <Image source={agregarIcono} style={styles.campanaIcono} />
        <Text style={styles.accionTexto}>Agregar</Text>
      </TouchableOpacity>
    </View>
  );
}

// Aquí irían todos los estilos tal como los tienes definidos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e5dcb9ff' },
  titulo: { marginTop: 35, fontSize: 25, fontWeight: "bold", textAlign: "center" },
  conetenedorEncabezado: { backgroundColor: "#ffff", width: "100%", height: "10%", alignItems: "center" },
  imagenFiltro: { marginTop: 35, width: 35, height: 35, position: "absolute", right: 10 },
  scrollContenido: { paddingBottom: 40, flexGrow: 1 },
  contenedorDeTodasLasTransaccione: { marginTop: 20, backgroundColor: "#ffffffff", marginLeft: 15, marginRight: 15, borderRadius: 15, paddingVertical: 15 },
  conendorTransaccion: { marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  imagenRestaurante: { position: "absolute", width: 40, height: 40, marginTop: 1, marginLeft: 1 },
  textoTransaccion: { fontSize: 18, marginTop: 20, marginLeft: 80, fontWeight: "bold" },
  textoTransaccionCategoria: { marginLeft: 80, fontSize: 14, color: '#555' },
  dineroComida: { position: "absolute", right: 20, marginTop: 30, fontSize: 20, color: "red" },
  dineroSalario: { color: "#9ad654ff" },
  contenedorBotonesEliminaryEditar: { flexDirection: "row", marginTop: 10 },
  botonEditar: { backgroundColor: "#72b13eff", width: "30%", height: 30, alignItems: "center", justifyContent: "center", marginLeft: 20, borderRadius: 15 },
  textoEditar: { fontSize: 18, color: "#fff" },
  botonEliminar: { backgroundColor: "red", width: "30%", height: 30, alignItems: "center", justifyContent: "center", marginLeft: 20, borderRadius: 15 },
  textoEliminar: { fontSize: 17, color: "#fff" },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContenido: { backgroundColor: '#fff', width: '85%', borderRadius: 15, padding: 20, alignItems: 'center', paddingBottom: 30 },
  editarTransaccion: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "black", marginTop: 15, width: "100%", borderRadius: 5, padding: 10, marginBottom: 15 },
  modalBotones: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 },
  botonBase: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  botonGuardar: { backgroundColor: '#d8c242ff' },
  botonGuardarTexto: { color: '#000000ff', fontWeight: 'bold', fontSize: 16 },
  botonCancelar: { backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#ccc' },
  botonCancelarTexto: { color: '#333', fontWeight: 'bold', fontSize: 16 },
  busquueda: { backgroundColor: "#ffffff", marginHorizontal: 30, marginTop: 20, paddingHorizontal: 10, height: 40, borderRadius: 8, borderWidth: 1, borderColor: "#ccc", marginBottom: 20 },
  accionBoton: { backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 16, alignItems: 'center', width: '22%', elevation: 4, left: 270, marginBottom: 20 },
  accionTexto: { fontSize: 12, color: '#333', marginTop: 4 },
  campanaIcono: { width: 25, height: 25, resizeMode: 'contain' },
  iconoContenedor: { width: 52, height: 52, borderRadius: 30, justifyContent: "center", alignItems: "center", position: "absolute", marginTop: 15, marginLeft: 20, backgroundColor: "#fdecea" },
  contenedorFiltrosTipo: { flexDirection: "row", justifyContent: "center", marginVertical: 10, gap: 10 },
  botonFiltro: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: "#e3e3e3" },
  botonActivo: { backgroundColor: "#4caf50" },
  textoBoton: { color: "#000", fontSize: 14, fontWeight: "bold" },
});
