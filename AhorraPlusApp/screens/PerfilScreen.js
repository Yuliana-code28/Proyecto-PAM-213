import React from 'react';
import {Text, TouchableOpacity, StatusBar, StyleSheet, View, ScrollView, Image} from 'react-native';

const transIcono = require('../assets/imagen/trans.png');
const inicio = require('../assets/imagen/casa.png');
const grafica = require('../assets/imagen/grafico.png');
const perfil = require('../assets/imagen/user.png');
const flecha = require('../assets/imagen/flec.png');
const configIcono = require('../assets/imagen/configuraciones.png');
const categoriaIcono = require('../assets/imagen/carpeta.png');
const calendarioIcono = require('../assets/imagen/calendario.png');
const editarIcono = require('../assets/imagen/editar.png');
const campanaIcono = require('../assets/imagen/campana.png');
const seguridadIcono = require('../assets/imagen/seguridad.png');

export default function PerfilScreen() {
  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#e5dcb9ff" />

        <View style={styles.encabezado}>
          <TouchableOpacity style={styles.botonIcono}>
            <Image source={flecha} style={styles.campanaIcono} />
          </TouchableOpacity>
          <Text style={styles.encabezadoTitulo}>Perfil</Text>
          <TouchableOpacity style={styles.botonIcono}>
            <Image source={configIcono} style={styles.campanaIcono} />
          </TouchableOpacity>
        </View>

        <View style={styles.tarjetaUsuario}>
          <View style={styles.avatar}>
            <Image source={perfil} style={styles.campanaIcono} />
          </View>
          <View style={styles.infoUsuarioTexto}>
            <Text style={styles.nombreUsuario}>Usuario Prueba</Text>
            <Text style={styles.correoUsuario}>usuario_prueba@gmail.com</Text>
            <Text style={styles.miembroDesde}>Miembro desde Octubre 2025</Text>
          </View>
        </View>

        <View style={styles.filaEstadisticas}>
          <View style={styles.tarjetaEstadistica}>
            <View
              style={[
                styles.contenedorIconoEstadistica,
                { backgroundColor: '#fef9c3' },
              ]}>
              <Image source={transIcono} style={styles.campanaIcono} />
            </View>
            <Text style={styles.numeroEstadistica}>143</Text>
            <Text style={styles.etiquetaEstadistica}>Transacciones</Text>
          </View>

          <View style={styles.tarjetaEstadistica}>
            <View
              style={[
                styles.contenedorIconoEstadistica,
                { backgroundColor: '#fef9c3' },
              ]}>
              <Image source={categoriaIcono} style={styles.campanaIcono} />
            </View>
            <Text style={styles.numeroEstadistica}>7</Text>
            <Text style={styles.etiquetaEstadistica}>Categorias</Text>
          </View>

          <View style={styles.tarjetaEstadistica}>
            <View
              style={[
                styles.contenedorIconoEstadistica,
                { backgroundColor: '#fef9c3' },
              ]}>
              <Image source={calendarioIcono} style={styles.campanaIcono} />
            </View>
            <Text style={styles.numeroEstadistica}>13</Text>
            <Text style={styles.etiquetaEstadistica}>Días activo</Text>
          </View>
        </View>

        <View style={styles.tarjetaOpciones}>
          <TouchableOpacity style={styles.itemOpcion}>
            <View style={styles.contenedorIconoOpcion}>
              <Image source={editarIcono} style={styles.campanaIcono} />
            </View>
            <View style={styles.contenedorTextoOpcion}>
              <Text style={styles.tituloOpcion}>Editar Perfil</Text>
              <Text style={styles.subtituloOpcion}>
                Actualiza tu información personal
              </Text>
            </View>
            <Text style={styles.flechaOpcion}>{'>'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemOpcion}>
            <View style={styles.contenedorIconoOpcion}>
              <Image source={campanaIcono} style={styles.campanaIcono} />
            </View>
            <View style={styles.contenedorTextoOpcion}>
              <Text style={styles.tituloOpcion}>Notificaciones</Text>
              <Text style={styles.subtituloOpcion}>Configura tus alertas</Text>
            </View>
            <Text style={styles.flechaOpcion}>{'>'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.itemOpcion, { borderBottomWidth: 0 }]}>
            <View style={styles.contenedorIconoOpcion}>
              <Image source={seguridadIcono} style={styles.campanaIcono} />
            </View>
            <View style={styles.contenedorTextoOpcion}>
              <Text style={styles.tituloOpcion}>Seguridad</Text>
              <Text style={styles.subtituloOpcion}>
                Contraseña y autenticación
              </Text>
            </View>
            <Text style={styles.flechaOpcion}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  encabezadoTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000ff',
  },
  botonIcono: {
    padding: 8,
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
    marginBottom: 24,
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
  barraNavegacion: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 10,
  },
  itemNavegacion: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoNavegacion: {
    fontSize: 12,
    marginTop: 5,
    color: '#000000ff',
  },
  textoNavegacionActivo: {
    color: '#d8c242ff',
    fontWeight: 'bold',
  },
  iconoNavegacion: {
    width: '30%',
    height: '40%',
    resizeMode: 'contain',
  },
  campanaIcono: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
});