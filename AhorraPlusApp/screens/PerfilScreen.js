import React, { useState, useEffect } from 'react'
import { Text, TouchableOpacity, StatusBar, StyleSheet, View, ScrollView, Image, Alert, Switch, Modal, TextInput } from 'react-native'
import { useAuth } from '../contexto/AuthContext';
import TransactionController from '../controllers/TransactionController';

const transIcono = require('../assets/imagen/trans.png');
const perfil = require('../assets/imagen/user.png');
const categoriaIcono = require('../assets/imagen/carpeta.png');
const calendarioIcono = require('../assets/imagen/calendario.png');
const editarIcono = require('../assets/imagen/editar.png');
const campanaIcono = require('../assets/imagen/campana.png');
const seguridadIcono = require('../assets/imagen/seguridad.png');

export default function PerfilScreen({ navigation }) {
  
  const { user, logout, changeName, changePassword } = useAuth();

  const [totalTransacciones, setTotalTransacciones] = useState(0);
  const [totalCategorias, setTotalCategorias] = useState(0);
  const [diasActivos, setDiasActivos] = useState(0);


  const [modalNombreVisible, setModalNombreVisible] = useState(false);
  const [modalSeguridadVisible, setModalSeguridadVisible] = useState(false);
  const [notificacionesModalVisible, setNotificacionesModalVisible] = useState(false);

  
  const [editNombre, setEditNombre] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [notifPresupuesto , setNotifPresupuesto] = useState(true);
  const [notifTransacciones, setNotifTransacciones] = useState(true);

  useEffect(() => {
    if (user) {
      cargarEstadisticas();
    }
  }, [user]);

  const cargarEstadisticas = async () => {
    const transacciones = await TransactionController.getAll(user.id);
    setTotalTransacciones(transacciones.length);
    const categoriasUnicas = new Set(transacciones.map(t => t.categoria));
    setTotalCategorias(categoriasUnicas.size);
    const fechasUnicas = new Set(transacciones.map(t => t.fecha));
    setDiasActivos(fechasUnicas.size);
  };

  const formatearFecha = (fechaString) => {
    if (!fechaString) return "Fecha no disponible";
    try {
      const fechaSegura = fechaString.replace(" ", "T");
      const fecha = new Date(fechaSegura);
      if (isNaN(fecha.getTime())) return "Miembro activo";
      return `Miembro desde ${fecha.toLocaleDateString()}`;
    } catch (e) {
      return "Miembro activo";
    }
  };

  const handleCerrarSesion = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que quieres salir?", [
      { text: "Cancelar" },
      { text: "Salir", onPress: () => logout() }
    ]);
  };


  const abrirModalNombre = () => {
    setEditNombre(user.nombre);
    setModalNombreVisible(true);
  }

  const guardarNombre = async () => {
      if(!editNombre.trim()){
          Alert.alert("Error", "El nombre es requerido");
          return;
      }
      const resultado = await changeName(editNombre);
      if(resultado.success){
          Alert.alert("Éxito", "Nombre actualizado correctamente");
          setModalNombreVisible(false);
      } else {
          Alert.alert("Error", resultado.error);
      }
  }


  const abrirModalSeguridad = () => {
    setNewPassword('');
    setConfirmPassword('');
    setModalSeguridadVisible(true);
  }

  const guardarPassword = async () => {
      if(!newPassword.trim() || !confirmPassword.trim()){
          Alert.alert("Error", "Todos los campos son requeridos");
          return;
      }
      if(newPassword !== confirmPassword){
          Alert.alert("Error", "Las contraseñas no coinciden");
          return;
      }

      const resultado = await changePassword(newPassword);
      if(resultado.success){
          Alert.alert("Éxito", "Contraseña actualizada correctamente");
          setModalSeguridadVisible(false);
      } else {
          Alert.alert("Error", resultado.error);
      }
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#e5dcb9ff" />

        <View style={styles.encabezado}>
          <Text style={styles.encabezadoTitulo}>Perfil</Text>
        </View>

        <View style={styles.tarjetaUsuario}>
          <View style={styles.avatar}>
            <Image source={perfil} style={styles.campanaIcono} />
          </View>
          <View style={styles.infoUsuarioTexto}>
            <Text style={styles.nombreUsuario}>{user.nombre}</Text>
            <Text style={styles.correoUsuario}>{user.correo}</Text>
            <Text style={styles.miembroDesde}>{formatearFecha(user.fechaCreacion)}</Text>
          </View>
        </View>

        <View style={styles.filaEstadisticas}>
          <View style={styles.tarjetaEstadistica}>
            <View style={[styles.contenedorIconoEstadistica, { backgroundColor: '#fef9c3' }]}>
              <Image source={transIcono} style={styles.campanaIcono} />
            </View>
            <Text style={styles.numeroEstadistica}>{totalTransacciones}</Text>
            <Text style={styles.etiquetaEstadistica}>Transacciones</Text>
          </View>

          <View style={styles.tarjetaEstadistica}>
            <View style={[styles.contenedorIconoEstadistica, { backgroundColor: '#fef9c3' }]}>
              <Image source={categoriaIcono} style={styles.campanaIcono} />
            </View>
            <Text style={styles.numeroEstadistica}>{totalCategorias}</Text>
            <Text style={styles.etiquetaEstadistica}>Categorías</Text>
          </View>

          <View style={styles.tarjetaEstadistica}>
            <View style={[styles.contenedorIconoEstadistica, { backgroundColor: '#fef9c3' }]}>
              <Image source={calendarioIcono} style={styles.campanaIcono} />
            </View>
            <Text style={styles.numeroEstadistica}>{diasActivos}</Text>
            <Text style={styles.etiquetaEstadistica}>Días Activos</Text>
          </View>
        </View>

        <View style={styles.tarjetaOpciones}>
         
          <TouchableOpacity style={styles.itemOpcion} onPress={abrirModalNombre}>
            <View style={styles.contenedorIconoOpcion}>
              <Image source={editarIcono} style={styles.campanaIcono} />
            </View>
            <View style={styles.contenedorTextoOpcion}>
              <Text style={styles.tituloOpcion}>Editar Perfil</Text>
              <Text style={styles.subtituloOpcion}>Actualiza tu nombre</Text>
            </View>
            <Text style={styles.flechaOpcion}>{'>'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemOpcion} onPress={() => setNotificacionesModalVisible(true)}>
            <View style={styles.contenedorIconoOpcion}>
              <Image source={campanaIcono} style={styles.campanaIcono} />
            </View>
            <View style={styles.contenedorTextoOpcion}>
              <Text style={styles.tituloOpcion}>Notificaciones</Text>
              <Text style={styles.subtituloOpcion}>Configura tus alertas</Text>
            </View>
            <Text style={styles.flechaOpcion}>{'>'}</Text>
          </TouchableOpacity>

          
          <TouchableOpacity style={[styles.itemOpcion, { borderBottomWidth: 0 }]} onPress={abrirModalSeguridad}>
            <View style={styles.contenedorIconoOpcion}>
              <Image source={seguridadIcono} style={styles.campanaIcono} />
            </View>
            <View style={styles.contenedorTextoOpcion}>
              <Text style={styles.tituloOpcion}>Seguridad</Text>
              <Text style={styles.subtituloOpcion}>Cambiar contraseña</Text>
            </View>
            <Text style={styles.flechaOpcion}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.botonCerrarSesion} onPress={handleCerrarSesion}>
            <Text style={styles.textoCerrarSesion}>Cerrar Sesión</Text>
        </TouchableOpacity>

      </ScrollView>

   
      <Modal animationType="slide" transparent={true} visible={modalNombreVisible} onRequestClose={() => setModalNombreVisible(false)}>
          <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Editar Nombre</Text>
                  
                  <View style={{alignItems:'center', marginBottom: 20}}>
                      <View style={styles.avatarGrande}>
                         <Image source={perfil} style={{width: 50, height: 50}} />
                      </View>
                  </View>

                  <Text style={styles.label}>Nombre</Text>
                  <TextInput 
                      style={styles.inputModal} 
                      value={editNombre} 
                      onChangeText={setEditNombre} 
                      placeholder="Tu nombre"
                  />

                  <View style={styles.modalButtons}>
                      <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setModalNombreVisible(false)}>
                          <Text style={{color: '#333'}}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={guardarNombre}>
                          <Text style={{color: '#fff', fontWeight: 'bold'}}>Guardar</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
      </Modal>

 
      <Modal animationType="slide" transparent={true} visible={modalSeguridadVisible} onRequestClose={() => setModalSeguridadVisible(false)}>
          <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Cambiar Contraseña</Text>

                  <Text style={styles.label}>Nueva Contraseña</Text>
                  <TextInput 
                      style={styles.inputModal} 
                      value={newPassword} 
                      onChangeText={setNewPassword} 
                      placeholder="Nueva contraseña"
                      secureTextEntry
                  />

                  <Text style={styles.label}>Confirmar Contraseña</Text>
                  <TextInput 
                      style={styles.inputModal} 
                      value={confirmPassword} 
                      onChangeText={setConfirmPassword} 
                      placeholder="Repite la contraseña"
                      secureTextEntry
                  />

                  <View style={styles.modalButtons}>
                      <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setModalSeguridadVisible(false)}>
                          <Text style={{color: '#333'}}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={guardarPassword}>
                          <Text style={{color: '#fff', fontWeight: 'bold'}}>Guardar</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
      </Modal>

    
      <Modal animationType='fade' transparent={true} visible={notificacionesModalVisible} onRequestClose={() => setNotificacionesModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Configurar Notificaciones</Text>

                <View style={styles.switchRow}>
                  <Text style={styles.label}>Alertas de Presupuesto</Text>
                  <Switch trackColor={{false: "#767577", true: "#d8c242ff"}}
                  thumbColor={notifPresupuesto ? "#f4f3f4" : "#f4f3f4"}
                  onValueChange={setNotifPresupuesto}
                  value={notifPresupuesto}
                  />
                </View>

                <View style={styles.switchRow}>
                  <Text style={styles.label}>Alertas de Transacciones</Text>
                  <Switch trackColor={{false: "#767577", true: "#d8c242ff"}}
                  thumbColor={notifTransacciones ? "#f4f3f4" : "#f4f3f4"}
                  onValueChange={setNotifTransacciones}
                  value={notifTransacciones}
                  />
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={() => setNotificacionesModalVisible(false)}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#e5dcb9ff',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 120,
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 24,
  },
  encabezadoTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000ff',
  },
  tarjetaUsuario: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#d8c242ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    overflow: 'hidden'
  },
  avatarGrande: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#d8c242ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoUsuarioTexto: {
    flex: 1,
  },
  nombreUsuario: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  correoUsuario: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  miembroDesde: {
    color: '#AAAAAA',
    fontSize: 12,
    marginTop: 4,
  },
  filaEstadisticas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  tarjetaEstadistica: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '31%',
    elevation: 4,
  },
  contenedorIconoEstadistica: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  numeroEstadistica: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000ff',
  },
  etiquetaEstadistica: {
    fontSize: 11,
    color: '#777',
  },
  tarjetaOpciones: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 4,
    marginBottom: 40, 
  },
  itemOpcion: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  contenedorIconoOpcion: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contenedorTextoOpcion: {
    flex: 1,
  },
  tituloOpcion: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000ff',
  },
  subtituloOpcion: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  flechaOpcion: {
    fontSize: 16,
    color: '#999',
  },
  campanaIcono: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  botonCerrarSesion: {
      backgroundColor: '#EF4444',
      paddingVertical: 15,
      paddingHorizontal: 40,
      borderRadius: 25,
      alignSelf: 'center',
      elevation: 5
  },
  textoCerrarSesion: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 16
  },
  modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
      width: '85%',
      backgroundColor: '#FFF',
      borderRadius: 20,
      padding: 20,
      elevation: 5
  },
  modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20
  },
  label: {
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#555'
  },
  inputModal: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      padding: 10,
      marginBottom: 15,
      backgroundColor: '#f9f9f9'
  },
  modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10
  },
  modalBtn: {
      flex: 1,
      padding: 12,
      borderRadius: 10,
      alignItems: 'center',
      marginHorizontal: 5
  },
  cancelBtn: {
      backgroundColor: '#e0e0e0'
  },
  saveBtn: {
      backgroundColor: '#d8c242ff'
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
});