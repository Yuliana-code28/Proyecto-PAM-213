import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Modal, TextInput, Switch } from 'react-native';
import TransactionController from '../controllers/TransactionController';
import UserController from "../controllers/UserController";



const filtro = require('../assets/imagen/filtrar.png');
const iconoGasto = require('../assets/imagen/gastos3.png');
const iconoIngreso = require('../assets/imagen/ingresos2.png');
const agregarIcono = require('../assets/imagen/agregar.png');

export default function TransaccionesScreen() {
  const [transactions, setTransactions] = useState([]);

  const [modalVisibleAdd, setModalVisibleAdd] = useState(false);
  const [modalVisibleEdit, setModalVisibleEdit] = useState(false);

  const [addTransaccion, setAddTransaccion] = useState('');
  const [addCategoria, setAddCategoria] = useState('');
  const [addMonto, setAddMonto] = useState('');
  const [addEsGasto, setAddEsGasto] = useState(true);

  const [editTransaccion, setEditTransaccion] = useState('');
  const [editCategoria, setEditCategoria] = useState('');
  const [editMonto, setEditMonto] = useState('');
  const [editEsGasto, setEditEsGasto] = useState(true);

  const [transactionToEdit, setTransactionToEdit] = useState(null);
  const [userId, setUserId] = useState(null);

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [modalFiltroTipo, setModalFiltroTipo] = useState(false);

  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [modalFiltroFecha, setModalFiltroFecha] = useState(false);

  const limpiarFiltros = () => {
    setFiltroTipo("todos");      
    setSelectedCategory("todas"); 
    setTextoBusqueda("");        
    setFechaInicio("");           
    setFechaFin("");              
  };

  const categorias = [
    "Comida",
    "Transporte",
    "Casa",
    "Entretenimiento",
    "Salud",
    "Otros",
  ];
  
  const transaccionesFiltradas = transactions.filter((t) => {
  
    
    if (filtroTipo !== "todos" && t.tipo.trim() !== filtroTipo) return false;
  
  
    if (
      selectedCategory !== "todas" &&
      t.categoria.trim() !== selectedCategory
    ) {
      return false;
    }
  
    
    if (textoBusqueda.trim() !== "") {
      const texto = textoBusqueda.toLowerCase().trim();
      const coincideDescripcion = (t.descripcion.trim() || "")
        .toLowerCase().trim()
        .includes(texto);
      const coincideCategoria = (t.categoria || "")
        .toLowerCase()
        .includes(texto);
  
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
  };

  const handleDelete = async (id) => {
    if (!userId) return;

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
    if (!addTransaccion || !addCategoria || !addMonto)
      return Alert.alert("Error", "Completa todos los campos.");

    const tipo = addEsGasto ? "gasto" : "ingreso";
    const monto = parseFloat(addMonto);
    const fecha = new Date().toISOString().split("T")[0];

    await TransactionController.add(userId, monto, addCategoria, addTransaccion, tipo, fecha);

    resetAddFields();
    setModalVisibleAdd(false);
  };

  const handleEdit = async () => {
    if (!editTransaccion || !editCategoria || !editMonto)
      return Alert.alert("Error", "Completa todos los campos.");

    const tipo = editEsGasto ? "gasto" : "ingreso";
    const monto = parseFloat(editMonto);

    await TransactionController.updateTransaction(
      transactionToEdit.id,
      userId,
      monto,
      editCategoria,
      editTransaccion,
      tipo,
      transactionToEdit.fecha
    );

    resetEditFields();
    setModalVisibleEdit(false);
  };

  const handleEditModal = (transaction) => {
    setTransactionToEdit(transaction);

    setEditTransaccion(transaction.descripcion);
    setEditCategoria(transaction.categoria);
    setEditMonto(String(transaction.monto));
    setEditEsGasto(transaction.tipo === "gasto");

    setModalVisibleEdit(true);
  };

  const resetAddFields = () => {
    setAddTransaccion('');
    setAddCategoria('');
    setAddMonto('');
    setAddEsGasto(true);
  };

  const resetEditFields = () => {
    setEditTransaccion('');
    setEditCategoria('');
    setEditMonto('');
    setEditEsGasto(true);
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

        <View style={styles.botonera}>
          <TouchableOpacity style={styles.botonAbrirModal}onPress={() => setModalFiltroTipo(true)}>
            <Text style={styles.textoAbrirModal}>Filtrar por tipo</Text>
          </TouchableOpacity>
        
          <TouchableOpacity style={styles.openFilterButton} onPress={() => setCategoryModalVisible(true)}>
            <Text style={styles.openFilterButtonText}>Filtrar por categoría</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginLeft:20}}>
        <TouchableOpacity style={styles.botonAbrirModal} onPress={() => setModalFiltroFecha(true)}>
           <Text style={styles.textoAbrirModal}>Filtrar por Fecha</Text>
        </TouchableOpacity>
        </View>
       

        <View style={styles.contenedorDeTodasLasTransaccione}>
        <TouchableOpacity  style={styles.botonLimpiarFiltros} onPress={limpiarFiltros}>
           <Text style={styles.textoLimpiarFiltros}>Recargar</Text>
        </TouchableOpacity>

          {transaccionesFiltradas.length === 0 ? (
            <Text style={{ textAlign: "center", marginVertical: 30, fontSize: 16, color: "#555" }}>
              No hay transacciones registradas.
            </Text>
          ) : (
            transaccionesFiltradas.map((t) => (
              <View key={t.id} style={styles.conendorTransaccion}>
                <View style={styles.iconoContenedor}>
                  <Image source={tipodeicono(t.tipo)} style={styles.imagenRestaurante} />
                </View>

                <Text style={styles.textoTransaccion}>{t.descripcion}</Text>
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

   
      <Modal animationType="fade" transparent={true} visible={modalVisibleAdd}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Agregar Transacción</Text>

            <TextInput style={styles.modalInput} placeholder="Descripción" value={addTransaccion} onChangeText={setAddTransaccion} />
            <TextInput style={styles.modalInput} placeholder="Categoría" value={addCategoria} onChangeText={setAddCategoria} />
            <TextInput style={styles.modalInput} placeholder="Monto" value={addMonto} keyboardType='numeric' onChangeText={setAddMonto} />

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Gasto</Text>
              <Switch value={!addEsGasto} onValueChange={() => setAddEsGasto(!addEsGasto)} />
              <Text style={styles.switchText}>Ingreso</Text>
            </View>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => { setModalVisibleAdd(false); resetAddFields(); }}>
                <Text style={styles.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnSave} onPress={handleAdd}>
                <Text style={styles.btnSaveText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

     
      <Modal animationType="fade" transparent={true} visible={modalVisibleEdit}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Editar Transacción</Text>

            <TextInput style={styles.modalInput} placeholder="Descripción" value={editTransaccion} onChangeText={setEditTransaccion} />
            <TextInput style={styles.modalInput} placeholder="Categoría" value={editCategoria} onChangeText={setEditCategoria} />
            <TextInput style={styles.modalInput} placeholder="Monto" value={editMonto} keyboardType='numeric' onChangeText={setEditMonto} />

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Gasto</Text>
              <Switch value={!editEsGasto} onValueChange={() => setEditEsGasto(!editEsGasto)} />
              <Text style={styles.switchText}>Ingreso</Text>
            </View>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => { setModalVisibleEdit(false); resetEditFields(); }}>
                <Text style={styles.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnSave} onPress={handleEdit}>
                <Text style={styles.btnSaveText}>Guardar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.accionBoton} onPress={() => { resetAddFields(); setModalVisibleAdd(true); }}>
        <Image source={agregarIcono} style={styles.campanaIcono} />
        <Text style={styles.accionTexto}>Agregar</Text>
      </TouchableOpacity>
      



      <Modal
         visible={categoryModalVisible}
         transparent
         animationType="fade"
         onRequestClose={() => setCategoryModalVisible(false)} >

         <View style={styles.modalOverlay}>
           <View style={styles.modalContainer}>
       
            <Text style={styles.modalTitle}>Filtrar por Categoría</Text>

            <ScrollView style={{ maxHeight: 300 }}>
        
             <TouchableOpacity style={[ styles.filterOption,selectedCategory === "todas" && styles.optionActive]}
               onPress={() => {setSelectedCategory("todas");
               setCategoryModalVisible(false);}}>
               <Text style={[ styles.filterOptionText,selectedCategory === "todas" && styles.optionActiveText ]} > Todas </Text>
             </TouchableOpacity>

             {categorias.map((cat, index) => (
               <TouchableOpacity key={index} style={[ styles.filterOption, selectedCategory === cat && styles.optionActive]}
                 onPress={() => {setSelectedCategory(cat);
                   setCategoryModalVisible(false);}}>
             <Text style={[ styles.filterOptionText, selectedCategory === cat && styles.optionActiveText  ]}> {cat} </Text>
          </TouchableOpacity>
        ))}
       
       </ScrollView>

      <TouchableOpacity onPress={() => setCategoryModalVisible(false)} style={styles.closeButton} >
        <Text style={styles.closeButtonText}>Cerrar</Text>
      </TouchableOpacity>

      </View>
    </View>
  </Modal>


     <Modal animationType="fade" transparent={true} visible={modalFiltroTipo}>
       <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Filtrar por tipo</Text>

            <TouchableOpacity
              style={[styles.botonMinimal, filtroTipo === "todos" && styles.botonMinimalActivo]}
              onPress={() => { setFiltroTipo("todos"); setModalFiltroTipo(false); }}
            >
              <Text style={[styles.botonMinimalTexto, filtroTipo === "todos" && styles.botonMinimalTextoActivo]}>
                Todos
              </Text>
            </TouchableOpacity>

   
             <TouchableOpacity
               style={[styles.botonMinimal, filtroTipo === "gasto" && styles.botonMinimalActivo]}
               onPress={() => { setFiltroTipo("gasto"); setModalFiltroTipo(false); }}>
               <Text style={[styles.botonMinimalTexto, filtroTipo === "gasto" && styles.botonMinimalTextoActivo]}>
                 Gastos
               </Text>
             </TouchableOpacity>

      
             <TouchableOpacity
               style={[styles.botonMinimal, filtroTipo === "ingreso" && styles.botonMinimalActivo]}
               onPress={() => { setFiltroTipo("ingreso"); setModalFiltroTipo(false); }}
             >
               <Text style={[styles.botonMinimalTexto, filtroTipo === "ingreso" && styles.botonMinimalTextoActivo]}>
                 Ingresos
               </Text>
             </TouchableOpacity>
       
             <View style={{ marginTop: 15 }}>
               <TouchableOpacity style={styles.botonCancelar} onPress={() => setModalFiltroTipo(false)}>
                 <Text style={styles.cancelarText}>Cerrar</Text>
               </TouchableOpacity>
             </View>
    
        </View>
       </View>
     </Modal>



     <Modal animationType="fade" transparent={true} visible={modalFiltroFecha}>
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
                style={styles.btnCancel}  onPress={() => setModalFiltroFecha(false)}>
                <Text style={styles.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>
      
              <TouchableOpacity style={styles.btnSave}
                onPress={async () => {
                  if (!userId || !fechaInicio || !fechaFin) return;
                  const resultados = await TransactionController.getFecha(userId, fechaInicio, fechaFin);
                  setTransactions(resultados);
                  setModalFiltroFecha(false);
                }}
              >
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

 

  conetenedorEncabezado: {
    backgroundColor: "#ffff",
    width: "100%",
    height: "10%",
    alignItems: "center"
  },

  titulo: {
    marginTop: 35,
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center"
  },

  imagenFiltro: {
    marginTop: 35,
    width: 35,
    height: 35,
    position: "absolute",
    right: 10
  },

 

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
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
    marginTop: 12
  },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20
  },

  switchText: {
    fontSize: 16,
    marginHorizontal: 10
  },

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

  btnCancelText: {
    fontWeight: "bold",
    color: "#555",
    fontSize: 16
  },

  btnSave: {
    flex: 1,
    backgroundColor: "#d8c242ff",
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 8,
    alignItems: "center"
  },

  btnSaveText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000"
  },



  contenedorDeTodasLasTransaccione: {
    marginTop: 20,
    backgroundColor: "#ffffff",
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 15,
    paddingVertical: 15,
  },

  conendorTransaccion: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },

  iconoContenedor: {
    width: 52,
    height: 52,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    marginTop: 15,
    marginLeft: 20,
    backgroundColor: "#fdecea"
  },

  imagenRestaurante: {
    width: 40,
    height: 40
  },

  textoTransaccion: {
    fontSize: 18,
    marginTop: 20,
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
    marginTop: 30,
    fontSize: 20,
    color: "red"
  },

  dineroSalario: {
    color: "#9ad654ff"
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
    marginLeft: 20,
    borderRadius: 15
  },

  textoEliminar: {
    color: "#fff",
    fontSize: 17
  },

  textoEditar: {
    color: "#fff",
    fontSize: 18
  },



  accionBoton: {
    position:"absolute",
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    width: '22%',
    elevation: 4,
    left: 270,
    marginBottom: 20,
    marginTop:"180%"
  },

  campanaIcono: {
    width: 25,
    height: 25,
    resizeMode: 'contain'
  },

  accionTexto: {
    fontSize: 12,
    color: '#333',
    marginTop: 4
  },

 
  busquueda: {
    backgroundColor: "#ffffff",
    marginHorizontal: 30,
    marginTop: 20,
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20
  },

  
  contenedorFiltrosTipo: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    gap: 10
  },

  botonFiltro: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#e3e3e3"
  },

  botonActivo: {
    backgroundColor: "#4caf50"
  },
  textFiltro:{
    fontWeight:"bold",
    marginLeft:30,
    fontSize:20
  },modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    elevation: 10,
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },
  
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f4f4f4",
    marginBottom: 10,
  },
  
  filterOptionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  
  optionActive: {
    backgroundColor: "#d8c242ff",
    borderColor: "#bca21d",
  },
  
  optionActiveText: {
    color: "#000",
    fontWeight: "bold",
  },
  
  closeButton: {
    marginTop: 15,
    paddingVertical: 12,
    backgroundColor: "#333",
    borderRadius: 12,
  },
  
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  
  openFilterButton: {
    backgroundColor: "#d8c242ff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  
  openFilterButtonText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "700",
  },
  botonMinimal: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#b5b5b5",
    marginVertical: 6,
    alignItems: "center",
    backgroundColor: "#ffffff"
  },
  
  botonMinimalActivo: {
    borderColor: "#d8c242ff",
    backgroundColor: "#d8c242ff"
  },
  
  botonMinimalTexto: {
    fontSize: 16,
    color: "#333"
  },
  
  botonMinimalTextoActivo: {
    color: "#000",
    fontWeight: "bold"
  },botonAbrirModal: {
    backgroundColor: "#d8c242ff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  
  textoAbrirModal: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold"
  }, botonera: {
    flexDirection: 'row',     
    justifyContent: 'space-around', 
    alignItems: 'center',      
    marginVertical: 10,        
    paddingHorizontal: 10,    
  },botonCancelar:{
     alignItems:"center",
     justifyContent:"center",
     backgroundColor:"black",
     borderRadius:10,
     height:45
  }, cancelarText:{
    fontSize: 20,
    color: "#fff"
  },botonLimpiarFiltros:{
    marginLeft:250
  }

});


