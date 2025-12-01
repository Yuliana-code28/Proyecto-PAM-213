import React, { useState, useEffect } from 'react'
import { Text, TouchableOpacity, StatusBar, StyleSheet, View, ScrollView, Image, Alert, Switch, Modal, TextInput } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'

import TransactionController from '../controllers/TransactionController';
import UserController from '../controllers/UserController';

const transIcono = require('../assets/imagen/trans.png');
const perfil = require('../assets/imagen/user.png');
const categoriaIcono = require('../assets/imagen/carpeta.png');
const calendarioIcono = require('../assets/imagen/calendario.png');
const editarIcono = require('../assets/imagen/editar.png');
const campanaIcono = require('../assets/imagen/campana.png');
const seguridadIcono = require('../assets/imagen/seguridad.png');

export default function PerfilScreen({ route, navigation }) {
  const { user } = route.params || {};
  const userId = user ? user.id : 1;

  const isFocused = useIsFocused();

  const [datosUsuario, setDatosUsuario] = useState({
    nombre: 'Cargando...',
    correo: 'Cargando...',
    password: '', 
    fechaCreacion: new Date().toISOString(),
    foto: null
  });

  const [totalTransacciones, setTotalTransacciones] = useState(0);
  const [totalCategorias, setTotalCategorias] = useState(0);
  const [diasActivos, setDiasActivos] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [editNombre, setEditNombre] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editFoto, setEditFoto] = useState(null);

  const [notificacionesModalVisible, setNotificacionesModalVisible] = useState(false);
  const [notifPresupuesto , setNotifPresupuesto] = useState(true);
  const [notifTransacciones, setNotifTransacciones] = useState(true);

  useEffect(() => {
    if (isFocused) {
      cargarTodo();
    }
  }, [isFocused]);

  const cargarTodo = async () => {
    const usuarioReal = await UserController.getUser(userId);
    if (usuarioReal) {
      setDatosUsuario(usuarioReal);
      setEditNombre(usuarioReal.nombre);
      setEditFoto(usuarioReal.foto);
    }

    const transacciones = await TransactionController.getAll(userId);
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
      { text: "Salir",
        onPress: async () => {
          await UserController.logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Inicio' }]
          })
        } }
    ]);
  };

  const abrirModalEditar = () => {
    setEditNombre(datosUsuario.nombre);
    setEditPassword(''); 
    setModalVisible(true);
  }

  const abrirModalNotificaciones = () => {
    setNotificacionesModalVisible(true);
  }

  const guardarCambiosPerfil = async () => {
      if(!editNombre.trim() || !editPassword.trim()){
          Alert.alert("Error", "Nombre y Nueva Contraseña son requeridos");
          return;
      }

      const resultado = await UserController.updateUser(userId, editNombre, editPassword);
      
      if(resultado.success){
          Alert.alert("Éxito", "Perfil actualizado correctamente");
          setModalVisible(false);
          cargarTodo(); 
      } else {
          Alert.alert("Error", resultado.error);
      }
  }

  const cambiarFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permiso denegado", "Necesitamos permiso para acceder a tus fotos.");
      return;
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setEditFoto(result.assets[0].uri);
    };
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
            {datosUsuario.foto ? (
              <Image source={{ uri: datosUsuario.foto }} style={styles.avatarImagen} />
            ) : (
              <Image source={perfil} style={styles.campanaIcono} />
            )}
          </View>
          <View style={styles.infoUsuarioTexto}>
            <Text style={styles.nombreUsuario}>{datosUsuario.nombre}</Text>
            <Text style={styles.correoUsuario}>{datosUsuario.correo}</Text>
            <Text style={styles.miembroDesde}>{formatearFecha(datosUsuario.fechaCreacion)}</Text>
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
          <TouchableOpacity style={styles.itemOpcion} onPress={abrirModalEditar}>
            <View style={styles.contenedorIconoOpcion}>
              <Image source={editarIcono} style={styles.campanaIcono} />
            </View>
            <View style={styles.contenedorTextoOpcion}>
              <Text style={styles.tituloOpcion}>Editar Perfil</Text>
              <Text style={styles.subtituloOpcion}>Actualiza tu información</Text>
            </View>
            <Text style={styles.flechaOpcion}>{'>'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemOpcion} onPress={abrirModalNotificaciones}>
            <View style={styles.contenedorIconoOpcion}>
              <Image source={campanaIcono} style={styles.campanaIcono} />
            </View>
            <View style={styles.contenedorTextoOpcion}>
              <Text style={styles.tituloOpcion}>Notificaciones</Text>
              <Text style={styles.subtituloOpcion}>Configura tus alertas</Text>
            </View>
            <Text style={styles.flechaOpcion}>{'>'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.itemOpcion, { borderBottomWidth: 0 }]}>
            <View style={styles.contenedorIconoOpcion}>
              <Image source={seguridadIcono} style={styles.campanaIcono} />
            </View>
            <View style={styles.contenedorTextoOpcion}>
              <Text style={styles.tituloOpcion}>Seguridad</Text>
              <Text style={styles.subtituloOpcion}>Contraseña y autenticación</Text>
            </View>
            <Text style={styles.flechaOpcion}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.botonCerrarSesion} onPress={handleCerrarSesion}>
            <Text style={styles.textoCerrarSesion}>Cerrar Sesión</Text>
        </TouchableOpacity>

      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Editar Perfil</Text>
                  
                  <View style={{alignItems:'center', marginBottom: 20}}>
                      <View style={styles.avatarGrande}>
                         <Image source={perfil} style={{width: 50, height: 50}} />
                      </View>
                      <TouchableOpacity onPress={cambiarFoto}>
                          <Text style={{color: '#d8c242ff', fontWeight: 'bold', marginTop: 10}}>Cambiar Foto</Text>
                      </TouchableOpacity>
                  </View>

                  <Text style={styles.label}>Nombre</Text>
                  <TextInput 
                      style={styles.inputModal} 
                      value={editNombre} 
                      onChangeText={setEditNombre} 
                      placeholder="Tu nombre"
                  />

                  <Text style={styles.label}>Nueva Contraseña</Text>
                  <TextInput 
                      style={styles.inputModal} 
                      value={editPassword} 
                      onChangeText={setEditPassword} 
                      placeholder="Nueva contraseña"
                      secureTextEntry
                  />

                  <View style={styles.modalButtons}>
                      <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setModalVisible(false)}>
                          <Text style={{color: '#333'}}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={guardarCambiosPerfil}>
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