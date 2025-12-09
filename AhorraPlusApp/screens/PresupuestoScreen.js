import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [modalFiltroFecha, setModalFiltroFecha] = useState(false);

  const categorias = ["Comida", "Transporte", "Casa", "Entretenimiento", "Salud", "Otros"];


  const getCurrentMonth = () => {
    const now = new Date();
    return new Date().toISOString().slice(0, 10);
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        const user = await UserController.getLoggedUser();
        if (user && isActive) {
          setUserId(user.id);
          fetchBudgets(user.id);
        }
      };

      loadData();
      return () => { isActive = false; };
    }, [])
  );

  useEffect(() => {
    if (!userId) return;
    fetchBudgets(userId);
  }, [userId]);

  const fetchBudgets = async (id) => {
    setLoading(true);
    const allBudgets = await BudgetController.getAll(id);
    const allTransactions = await TransactionController.getAll(id);

    const budgetsWithProgress = allBudgets.map(b => {
      const gastado = allTransactions
        .filter(t =>
          t.tipo === 'gasto' &&
          t.fecha.startsWith(b.mes) &&
          (t.categoria.trim().toLowerCase() === b.descripcion.trim().toLowerCase() || b.descripcion === '')
        )
        .reduce((sum, t) => sum + t.monto, 0);
      return { ...b, gastado };
    });

    budgetsWithProgress.forEach(b => {
      if (b.gastado > b.monto) {
        sendNotificationToDashboard(
          `Presupuesto excedido en ${b.descripcion}. Límite: $${b.monto}, Gastado: $${b.gastado}`
        );
      }
    });

    setBudgets(budgetsWithProgress);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!inputMes || !inputMonto || !inputDescripcion) return Alert.alert("Error", "Completa todos los campos");
    if (!userId) return;

    const result = await BudgetController.saveBudget(userId, inputMonto, inputMes, inputDescripcion, isEditing ? currentId : null);

    if (result.success) {
      Alert.alert("Éxito", "Presupuesto guardado.");
      setModalVisible(false);
      resetFields();
      fetchBudgets(userId);
    } else {
      Alert.alert("Error", result.error);
    }
  };

  const handleDelete = (id) => {
    Alert.alert("Eliminar", "¿Borrar este presupuesto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar", style: "destructive", onPress: async () => {
          await BudgetController.deleteBudget(id);
          fetchBudgets(userId);
        }
      }
    ]);
  }

  const sendNotificationToDashboard = async (message) => {
    try {
      const current = await AsyncStorage.getItem('user_notifications');
      const parsed = current ? JSON.parse(current) : [];

      const exists = parsed.some(notif => notif.text === message);

      if (!exists) {
        const newNotif = { id: Date.now(), text: message, date: new Date().toLocaleDateString() };
        const updated = [newNotif, ...parsed];
        await AsyncStorage.setItem('user_notifications', JSON.stringify(updated));
      }
    } catch (e) {
      console.error("Error guardando notificación", e);
    }
  };

  const openNew = async () => {
    if (budgets.length >= 4) {
      Alert.alert("Límite Alcanzado", "Solo puedes tener máximo 4 presupuestos. Se ha enviado una notificación a tu Dashboard.");
      await sendNotificationToDashboard("Has alcanzado el límite de 4 presupuestos activos.");
      return;
    }

    setIsEditing(false);
    setCurrentId(null);
    setInputMes(getCurrentMonth());
    setMonto('');
    setInputDescripcion('');
    setModalVisible(true);
  }

  const openEdit = (b) => {
    setIsEditing(true);
    setCurrentId(b.id);
    setInputMes(b.mes);
    setMonto(b.monto.toString());
    setInputDescripcion(b.descripcion);
    setModalVisible(true);
  }

  const resetFields = () => {
    setInputMes(''); setMonto(''); setInputDescripcion(''); setIsEditing(false); setCurrentId(null);
  };


  const validarFechas = (fi, ff) => {
    const r = /^\d{4}-\d{2}-\d{2}$/;
    if (!r.test(fi) || !r.test(ff)) return false;
    return new Date(fi) <= new Date(ff);
  };

  const limpiarFiltros = () => {
    setSelectedCategory("todas");
    setTextoBusqueda("");
    setFechaInicio("");
    setFechaFin("");
    if (userId) fetchBudgets(userId);
  };

  const presupuestosFiltrados = budgets.filter((b) => {
 
    if (selectedCategory !== "todas") {
  
      if (b.descripcion.trim().toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
    }

 
    if (textoBusqueda.trim() !== "") {
      const txt = textoBusqueda.toLowerCase().trim();
      const desc = (b.descripcion || "").toLowerCase();
   
      const mes = (b.mes || "");
      if (!desc.includes(txt) && !mes.includes(txt)) return false;
    }


    if (fechaInicio && fechaFin) {
  
      const bDate = new Date(b.mes + "-01");
      const fInicio = new Date(fechaInicio);
      const fFin = new Date(fechaFin);

      if (bDate < fInicio || bDate > fFin) return false;
    }

    return true;
  });


  const getBarColor = (p) => p >= 100 ? '#EF4444' : p >= 75 ? '#F59E0B' : '#22C55E';

  return (
    <View style={styles.container}>
      <View style={styles.contenedorEncabezado}>
        <Text style={styles.titulo}>Presupuestos</Text>
        <Image source={filtro} style={styles.imagenFiltro} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContenido}>

      
        <TextInput
          style={styles.busqueda}
          placeholder="Buscar presupuesto"
          value={textoBusqueda}
          onChangeText={setTextoBusqueda}
        />

       
        <View style={styles.botonera}>
          <TouchableOpacity
            style={styles.openFilterButton}
            onPress={() => setCategoryModalVisible(true)}>
            <Text style={styles.openFilterButtonText}>Filtrar Categoría</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.openFilterButton}
            onPress={() => setModalFiltroFecha(true)}>
            <Text style={styles.openFilterButtonText}>Filtrar Fechas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.subtitulo}>Administra tus límites (Máx 4)</Text>
        </View>

        <View style={styles.contenedorDeTodasLasTransacciones}>

          <TouchableOpacity
            style={styles.botonLimpiarFiltros}
            onPress={limpiarFiltros}>
            <Text style={styles.textoLimpiarFiltros}>Recargar</Text>
          </TouchableOpacity>

          {presupuestosFiltrados.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 20, color: "#555" }}>
              {loading ? "Cargando..." : "No hay presupuestos registrados."}
            </Text>
          ) : (
            presupuestosFiltrados.map((b, index) => {
              const porcentaje = Math.min((b.gastado / b.monto) * 100, 100);
              const color = getBarColor(porcentaje);

              return (
                <View key={index} style={styles.contenedorTransaccion}>

                  <View style={styles.filaSuperior}>
                    <View style={styles.iconoContenedor}>
                      <Image source={iconoMeta} style={styles.imagenRestaurante} />
                    </View>

                    <View style={{ flex: 1, marginLeft: 15 }}>
                      <Text style={styles.textoTransaccion}>{b.descripcion}</Text>
                      <Text style={styles.textoTransaccionCategoria}>Mes: {b.mes}</Text>
                    </View>

                    <Text style={[styles.dineroComida, styles.dineroSalario]}>
                      ${b.monto}
                    </Text>
                  </View>

                  <View style={styles.progressContainer}>
                    <View style={styles.progressTextRow}>
                      <Text style={[
                        styles.progressText,
                        (b.monto - b.gastado) < 0 && { color: 'red', fontWeight: 'bold' }
                      ]}>
                        {(b.monto - b.gastado) >= 0 ? 'Restante:' : 'Excedido:'} ${(b.monto - b.gastado).toFixed(0)}
                      </Text>
                      <Text style={styles.progressText}>{porcentaje.toFixed(0)}%</Text>
                    </View>
                    <View style={styles.barBackground}>
                      <View style={[styles.barFill, { width: `${porcentaje}%`, backgroundColor: color }]} />
                    </View>
                  </View>

          
                  <View style={styles.botonesAccionContainer}>
                    <TouchableOpacity onPress={() => openEdit(b)} style={styles.botonEditarItem}>
                      <Text style={styles.textoBotonAccion}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(b.id)} style={styles.botonEliminarItem}>
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
            <TextInput style={styles.input} placeholder="2025-12" placeholderTextColor="#888" value={inputMes} onChangeText={setInputMes} />

            <Text style={styles.labelInput}>Categoría (Descripción)</Text>
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

    
      <Modal visible={categoryModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainerFilter}>
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

  
      <Modal visible={modalFiltroFecha} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Filtrar por Fecha</Text>
            <Text style={styles.labelInput}>Desde (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="2025-01-01"
              value={fechaInicio}
              onChangeText={setFechaInicio}
            />
            <Text style={styles.labelInput}>Hasta (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="2025-12-31"
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
                onPress={() => {
               
                  if (fechaInicio && fechaFin && !validarFechas(fechaInicio, fechaFin)) {
                    Alert.alert("Error", "Fechas inválidas");
                    return;
                  }
                  setModalFiltroFecha(false);
                }}>
                <Text style={styles.btnSaveText}>Aplicar</Text>
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
  contenedorEncabezado: {
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
  contenedorDeTodasLasTransacciones: {
    marginTop: 20,
    backgroundColor: "#ffffffff",
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 15,
    paddingVertical: 15
  },
  contenedorTransaccion: {
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
  // ----------------------------------------
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
    alignSelf: 'flex-start',
    marginLeft: 5,
    color: '#555',
    fontWeight: 'bold',
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

  busqueda: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 15,
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10
  },
  botonera: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 5
  },
  openFilterButton: {
    backgroundColor: "#d8c242ff",
    padding: 10,
    borderRadius: 10,
    width: "45%",
    alignItems: "center"
  },
  openFilterButtonText: { color: "black", fontWeight: "bold", fontSize:15},
  botonLimpiarFiltros: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 10
  },
  textoLimpiarFiltros: { color: '#007AFF', fontWeight: 'bold' },
 
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
  modalContainerFilter: {
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
    marginTop: 5,
    marginBottom: 15
  },
  filterOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  optionActive: {
    backgroundColor: "#d8c242ff"
  },
  filterOptionText: {
    fontSize: 16,
    color: "#333"
  },
  optionActiveText: {
    color: "black",
    fontWeight: "bold"
  },
  closeButton: {
    marginTop: 15,
    alignItems: "center",
    padding: 15,
    backgroundColor: "black",
    borderRadius: 8
  },
  closeButtonText: {
    fontWeight: "bold",
    color: "#fff"
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
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
  btnCancelText: { color: "#333", fontWeight: "bold" },
  btnSave: {
    flex: 1,
    backgroundColor: '#d8c242ff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center'
  },
  btnSaveText: { color: "#000", fontWeight: "bold" }
});