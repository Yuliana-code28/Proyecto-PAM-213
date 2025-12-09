import React, { useState, useEffect } from 'react';
import {  Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Modal, TextInput, Switch} from 'react-native';
import TransactionController from '../controllers/TransactionController';
import UserController from "../controllers/UserController";
import { useAuth } from '../contexto/AuthContext';

const filtro = require('../assets/imagen/filtrar.png');
const iconoGasto = require('../assets/imagen/gastos3.png');
const iconoIngreso = require('../assets/imagen/ingresos2.png');
const agregarIcono = require('../assets/imagen/agregar.png');

export default function TransaccionesScreen() {

  const { user } = useAuth();
  const userId = user ? user.id : null;

  const [transactions, setTransactions] = useState([]);

  const [modalVisibleAdd, setModalVisibleAdd] = useState(false);
  const [modalVisibleEdit, setModalVisibleEdit] = useState(false);

  const [addTransaccion, setAddTransaccion] = useState('');
  const [addCategoria, setAddCategoria] = useState('');
  const [addMonto, setAddMonto] = useState('');
  const [addEsGasto, setAddEsGasto] = useState(true);
  const [addFecha, setAddFecha] = useState('');

  const [editTransaccion, setEditTransaccion] = useState('');
  const [editCategoria, setEditCategoria] = useState('');
  const [editMonto, setEditMonto] = useState('');
  const [editEsGasto, setEditEsGasto] = useState(true);

  const [transactionToEdit, setTransactionToEdit] = useState(null);


  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [modalFiltroTipo, setModalFiltroTipo] = useState(false);

  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [modalFiltroFecha, setModalFiltroFecha] = useState(false);

  const categorias = ["Comida", "Transporte", "Casa", "Entretenimiento", "Salud", "Otros"];

  const validarFechas = (fi, ff) => {
    const r = /^\d{4}-\d{2}-\d{2}$/;
    if (!r.test(fi) || !r.test(ff)) return false;
    return new Date(fi) <= new Date(ff);
  };

  const limpiarFiltros = () => {
    setFiltroTipo("todos");
    setSelectedCategory("todas");
    setTextoBusqueda("");
    setFechaInicio("");
    setFechaFin("");
  };

  const transaccionesFiltradas = transactions.filter((t) => {

    if (filtroTipo !== "todos" && t.tipo.trim() !== filtroTipo) return false;

    if (selectedCategory !== "todas" && t.categoria.trim() !== selectedCategory)
      return false;

    if (textoBusqueda.trim() !== "") {
      const txt = textoBusqueda.toLowerCase().trim();
      const desc = (t.descripcion || "").toLowerCase();
      const cat = (t.categoria || "").toLowerCase();
      if (!desc.includes(txt) && !cat.includes(txt)) return false;
    }

    return true;
  });

  useEffect(() => {
    const loadUser = async () => {
      const u = await UserController.getLoggedUser();
      if (u) setUserId(u.id);
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

    const listener = () => fetchTransactions();
    TransactionController.addListener(listener);

    return () => TransactionController.removeListener(listener);

  }, [userId]);

  const tipodeicono = (tipo) => tipo === "ingreso" ? iconoIngreso : iconoGasto;

  const handleDelete = async (id) => {
    Alert.alert(
      "Eliminar Transacción",
      "¿Estás seguro?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Aceptar", onPress: async () => await TransactionController.delete(id, userId) }
      ]
    );
  };

  const handleAdd = async () => {
    if (!addTransaccion || !addCategoria || !addMonto || !addFecha)
      return Alert.alert("Error", "Completa todos los campos.");

    const tipo = addEsGasto ? "gasto" : "ingreso";

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(addFecha)) {
      return Alert.alert("Error", "Formato de fecha inválido (YYYY-MM-DD)")
    }

    const result = await TransactionController.add(
      userId,
      parseFloat(addMonto),
      addCategoria,
      addTransaccion,
      tipo,
      addFecha
    );
 
    if (result.success && result.alertMessage) {
      Alert.alert("Alerta de Presupuesto", result.alertMessage);
    }

    resetAddFields();
    setModalVisibleAdd(false);
  };

  const handleEdit = async () => {
    if (!editTransaccion || !editCategoria || !editMonto)
      return Alert.alert("Error", "Completa todos los campos.");

    await TransactionController.updateTransaction(
      transactionToEdit.id,
      userId,
      parseFloat(editMonto),
      editCategoria,
      editTransaccion,
      editEsGasto ? "gasto" : "ingreso",
      transactionToEdit.fecha
    );

    resetEditFields();
    setModalVisibleEdit(false);
  };

  const handleEditModal = (t) => {
    setTransactionToEdit(t);
    setEditTransaccion(t.descripcion);
    setEditCategoria(t.categoria);
    setEditMonto(String(t.monto));
    setEditEsGasto(t.tipo === "gasto");
    setModalVisibleEdit(true);
  };

  const resetAddFields = () => {
    setAddTransaccion('');
    setAddCategoria('');
    setAddMonto('');
    setAddEsGasto(true);
    setAddFecha(new Date().toISOString().split("T")[0]);
  };

  const resetEditFields = () => {
    setEditTransaccion('');
    setEditCategoria('');
    setEditMonto('');
    setEditEsGasto(true);
  };

  return (

    <View style={styles.container}>

   
      <View style={styles.contenedorEncabezado}>
        <Text style={styles.titulo}>Transacciones</Text>
        <Image source={filtro} style={styles.imagenFiltro} />
      </View>

      
      <ScrollView contentContainerStyle={styles.scrollContenido}>

        
        <TextInput
          style={styles.busqueda}
          placeholder="Buscar transacción"
          value={textoBusqueda}
          onChangeText={setTextoBusqueda}
        />

        <View style={styles.botonera}>
          <TouchableOpacity
            style={styles.botonAbrirModal}
            onPress={() => setModalFiltroTipo(true)}>
            <Text style={styles.textoAbrirModal}>Filtrar por tipo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.openFilterButton}
            onPress={() => setCategoryModalVisible(true)}>
            <Text style={styles.openFilterButtonText}>Filtrar por categoría</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity
            style={styles.botonAbrirModal}
            onPress={() => setModalFiltroFecha(true)}>
            <Text style={styles.textoAbrirModal}>Filtrar por fecha</Text>
          </TouchableOpacity>
        </View>

       
        <View style={styles.contenedorDeTodasLasTransacciones}>
          <TouchableOpacity
            style={styles.botonLimpiarFiltros}
            onPress={limpiarFiltros}>
            <Text style={styles.textoLimpiarFiltros}>Recargar</Text>
          </TouchableOpacity>

          {transaccionesFiltradas.length === 0 ? (
            <Text style={{ textAlign: "center", marginVertical: 30 }}>
              No hay transacciones registradas
            </Text>
          ) : (
            transaccionesFiltradas.map((t) => (
              <View key={t.id} style={styles.contenedorTransaccion}>

                <View style={styles.iconoContenedor}>
                  <Image source={tipodeicono(t.tipo)} style={styles.imagenRestaurante} />
                </View>

                <Text style={styles.textoTransaccion}>{t.descripcion}</Text>

                <Text style={styles.textoTransaccionCategoria}>
                  {t.categoria} - {t.fecha}
                </Text>

                <Text style={[
                  styles.dineroComida,
                  t.tipo === "ingreso" && styles.dineroSalario
                ]}>
                  {t.tipo === "gasto" ? `-$${t.monto}` : `+$${t.monto}`}
                </Text>

                <View style={styles.contenedorBotonesEliminaryEditar}>
                  <TouchableOpacity
                    style={styles.botonEditar}
                    onPress={() => handleEditModal(t)}>
                    <Text style={styles.textoEditar}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.botonEliminar}
                    onPress={() => handleDelete(t.id)}>
                    <Text style={styles.textoEliminar}>Eliminar</Text>
                  </TouchableOpacity>
                </View>

              </View>
            ))
          )}
        </View>

      </ScrollView>

      
      <TouchableOpacity
        style={styles.accionBoton}
        onPress={() => {
          resetAddFields();
          setModalVisibleAdd(true);
        }}>
        <Image source={agregarIcono} style={styles.campanaIcono} />
        <Text style={styles.accionTexto}>Agregar</Text>
      </TouchableOpacity>

      
      <Modal visible={modalVisibleAdd} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <Text style={styles.modalTitle}>Agregar Transacción</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Descripción"
              placeholderTextColor="#a4a4a4ff"
              value={addTransaccion}
              onChangeText={setAddTransaccion}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Categoría"
              placeholderTextColor="#a4a4a4ff"
              value={addCategoria}
              onChangeText={setAddCategoria}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Monto"
              placeholderTextColor="#a4a4a4ff"
              keyboardType="numeric"
              value={addMonto}
              onChangeText={setAddMonto}
            />

            <TextInput 
              style={styles.modalInput} 
              placeholder="Fecha (YYYY-MM-DD)" 
              placeholderTextColor="#a4a4a4ff"
              value={addFecha} 
              onChangeText={setAddFecha} />

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Gasto</Text>
              <Switch
                value={!addEsGasto}
                onValueChange={() => setAddEsGasto(!addEsGasto)}
              />
              <Text style={styles.switchText}>Ingreso</Text>
            </View>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => {
                  setModalVisibleAdd(false);
                  resetAddFields();
                }}>
                <Text style={styles.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnSave} onPress={handleAdd}>
                <Text style={styles.btnSaveText}>Guardar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      
      <Modal visible={modalVisibleEdit} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <Text style={styles.modalTitle}>Editar Transacción</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Descripción"
              placeholderTextColor="#a4a4a4ff"
              value={editTransaccion}
              onChangeText={setEditTransaccion}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Categoría"
              placeholderTextColor="#a4a4a4ff"
              value={editCategoria}
              onChangeText={setEditCategoria}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Monto"
              placeholderTextColor="#a4a4a4ff"
              value={editMonto}
              keyboardType="numeric"
              onChangeText={setEditMonto}
            />

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Gasto</Text>
              <Switch
                value={!editEsGasto}
                onValueChange={() => setEditEsGasto(!editEsGasto)}
              />
              <Text style={styles.switchText}>Ingreso</Text>
            </View>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => {
                  setModalVisibleEdit(false);
                  resetEditFields();
                }}>
                <Text style={styles.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnSave} onPress={handleEdit}>
                <Text style={styles.btnSaveText}>Guardar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      
      <Modal visible={categoryModalVisible} transparent animationType="fade">

        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>

            <Text style={styles.modalTitle}>Filtrar por Categoría</Text>

            <ScrollView style={{ maxHeight: 300 }}>

              <TouchableOpacity
                style={[styles.filterOption, selectedCategory === "todas" && styles.optionActive]}
                onPress={() => {
                  setSelectedCategory("todas");
                  setCategoryModalVisible(false);
                }}>
                <Text style={[styles.filterOptionText, selectedCategory === "todas" && styles.optionActiveText]}>
                  Todas
                </Text>
              </TouchableOpacity>

              {categorias.map((cat, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.filterOption, selectedCategory === cat && styles.optionActive]}
                  onPress={() => {
                    setSelectedCategory(cat);
                    setCategoryModalVisible(false);
                  }}>
                  <Text style={[styles.filterOptionText, selectedCategory === cat && styles.optionActiveText]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}

            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCategoryModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>

          </View>
        </View>

      </Modal>

      <Modal visible={modalFiltroTipo} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <Text style={styles.modalTitle}>Filtrar por tipo</Text>

            <TouchableOpacity
              style={[styles.botonMinimal, filtroTipo === "todos" && styles.botonMinimalActivo]}
              onPress={() => {
                setFiltroTipo("todos");
                setModalFiltroTipo(false);
              }}>
              <Text style={[styles.botonMinimalTexto, filtroTipo === "todos" && styles.botonMinimalTextoActivo]}>
                Todos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botonMinimal, filtroTipo === "gasto" && styles.botonMinimalActivo]}
              onPress={() => {
                setFiltroTipo("gasto");
                setModalFiltroTipo(false);
              }}>
              <Text style={[styles.botonMinimalTexto, filtroTipo === "gasto" && styles.botonMinimalTextoActivo]}>
                Gastos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botonMinimal, filtroTipo === "ingreso" && styles.botonMinimalActivo]}
              onPress={() => {
                setFiltroTipo("ingreso");
                setModalFiltroTipo(false);
              }}>
              <Text style={[styles.botonMinimalTexto, filtroTipo === "ingreso" && styles.botonMinimalTextoActivo]}>
                Ingresos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botonCancelar]}
              onPress={() => setModalFiltroTipo(false)}>
              <Text style={styles.cancelarText}>Cerrar</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      
      <Modal visible={modalFiltroFecha} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <Text style={styles.modalTitle}>Filtrar por Fecha</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Fecha Inicio (YYYY-MM-DD)"
              value={fechaInicio}
              onChangeText={setFechaInicio}
            />

            <TextInput
              style={styles.modalInput}
              placeholder="Fecha Fin (YYYY-MM-DD)"
              value={fechaFin}
              onChangeText={setFechaFin}
            />

            <View style={styles.modalButtonsContainer}>

              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => setModalFiltroFecha(false)}>
                <Text style={styles.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnSave}
                onPress={async () => {
                  if (!validarFechas(fechaInicio, fechaFin)) {
                    Alert.alert("Error", "Fechas inválidas.");
                    return;
                  }
                  const res = await TransactionController.getFecha(userId, fechaInicio, fechaFin);
                  setTransactions(res);
                  setModalFiltroFecha(false);
                }}>
                <Text style={styles.btnSaveText}>Filtrar</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5dcb9ff',
  },

  scrollContenido: {
    paddingBottom: 40,
    flexGrow: 1,
  },

  contenedorEncabezado: {
    backgroundColor: "#ffff",
    width: "100%",
    height: 90,
    alignItems: "center"
  },

  titulo: {
    marginTop: 35,
    fontSize: 25,
    fontWeight: "bold",
  },

  imagenFiltro: {
    width: 35,
    height: 35,
    position: "absolute",
    right: 10,
    top: 35,
  },

  busqueda: {
    backgroundColor: "#fff",
    marginHorizontal: 30,
    marginTop: 20,
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20
  },

  botonera: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10
  },

  botonAbrirModal: {
    backgroundColor: "#d8c242ff",
    padding: 10,
    borderRadius: 10,
    width: "40%",
    alignItems: "center"
  },

  textoAbrirModal: { color: "black", fontWeight: "bold", fontSize:15 },

  openFilterButton: {
    backgroundColor: "#d8c242ff",
    padding: 10,
    borderRadius: 10,
    width: "40%",
    alignItems: "center"
  },

  openFilterButtonText: { color: "black", fontWeight: "bold",fontSize:14 },

  contenedorDeTodasLasTransacciones: {
    marginTop: 20,
    backgroundColor: "#fff",
    marginHorizontal: 15,
    borderRadius: 15,
    paddingVertical: 15
  },

  botonLimpiarFiltros: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 10
  },

  textoLimpiarFiltros: { color: '#007AFF', fontWeight: 'bold' },

  contenedorTransaccion: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd"
  },

  iconoContenedor: {
    width: 52,
    height: 52,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    backgroundColor: "#fdecea",
    marginTop: 15,
    marginLeft: 20
  },

  imagenRestaurante: {
    width: 40,
    height: 40
  },

  textoTransaccion: {
    fontSize: 18,
    marginLeft: 80,
    marginTop: 20,
    fontWeight: "bold"
  },

  textoTransaccionCategoria: {
    marginLeft: 80,
    fontSize: 14,
    color: "#555"
  },

  dineroComida: {
    position: "absolute",
    right: 20,
    marginTop: 30,
    fontSize: 20,
    color: "red"
  },

  dineroSalario: { 
  color: "#72b13e" 
  },

  contenedorBotonesEliminaryEditar: {
    flexDirection: "row",
    marginTop: 10
  },

  botonEditar: {
    backgroundColor: "#72b13e",
    width: "30%",
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    borderRadius: 15
  },

  botonEliminar: {
    backgroundColor: "red",
    width: "30%",
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    borderRadius: 15
  },

  textoEditar: { color: "#fff",
   fontSize: 17 },
  textoEliminar: { color: "#fff",
   fontSize: 17 },

  accionBoton: {
    position: "absolute",
    bottom: 25,
    right: 20,
    backgroundColor: "#fff",
    paddingVertical: 12,
    width: 90,
    borderRadius: 16,
    alignItems: "center",
    elevation: 4
  },

  campanaIcono: { width: 25,
   height: 25 },

  accionTexto: { fontSize: 12,
   marginTop: 4,
   color: "#333" },

 
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },

  modalCard: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 16,
    elevation: 10
  },

  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center"
  },

  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
    color: '#000000ff',
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20
  },

  switchText: { fontSize: 16, 
  marginHorizontal: 10 },

  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20
  },

  btnCancel: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc"
  },

  btnCancelText: { color: "#333",
   fontWeight: "bold" },

  btnSave: {
    flex: 1,
    backgroundColor: "#d8c242ff",
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 8,
    alignItems: "center"
  },

  btnSaveText: { color: "black", 
  fontWeight: "bold" },

  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd"
  },

  filterOptionText: { 
  fontSize: 16 },

  optionActive: {
   backgroundColor: "#d8c242ff" },
  optionActiveText: { color: "black",
  fontWeight: "bold" },

  closeButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#333",
    borderRadius: 10,
    alignItems: "center"
  },

  closeButtonText: { color: "#fff",
   fontWeight: "bold" },


  botonMinimal: {
    backgroundColor: "#f3f3f3",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
  },

  botonMinimalActivo: { 
  backgroundColor: "#d8c242ff" },

  botonMinimalTexto: { fontSize: 16, 
  textAlign: "center" },

  botonMinimalTextoActivo: { color: "black",
   fontWeight: "bold" },

  botonCancelar: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "black"
  },

  cancelarText: { color: "#fff", 
  fontWeight: "bold", 
  textAlign: "center" },

});
