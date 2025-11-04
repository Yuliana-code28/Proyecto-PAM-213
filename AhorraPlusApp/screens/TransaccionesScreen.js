import React from 'react'
import { Text,View,StyleSheet, Image,TouchableOpacity} from 'react-native'

const flecha = require('../assets/imagen/flec.png');
const filtro = require('../assets/imagen/filtrar.png');
const busquedaImagen = require('../assets/imagen/buscar.png')

export default function TransaccionesScreen() {
  return (
    <View style={styles.container}>
          <View style={styles.conetenedorEncabezado}>
           <Image source={flecha} style={styles.imagenFlecha}/>
           <Text style={styles.titulo}>Transacciones</Text>
           <Image source={filtro} style={styles.imagenFiltro}/>
           <View style={styles.busqueda}>
            <Image source={busquedaImagen} style={styles.imagenBusqueda}/>
            <Text style={styles.textoBusquedaTransacciones}>Buscar transacciones...</Text>
           </View>
          <View style={styles.ContenedorDeTiposDetransacciones}>
           <Text style={styles.tipoDetransaccion}>Tipo</Text>
           <TouchableOpacity style={styles.botones}>
             <Text>Todos</Text>
           </TouchableOpacity>
           </View>
          </View>
          
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5dcb9ff',
  },titulo:{
    marginTop:35,
    fontSize:25,
    fontWeight:"bold",
    textAlign:"center"
  },imagenFlecha:{
    marginTop:35,
    position:"absolute",
    width:40,
    height:40,
    left:10
  },conetenedorEncabezado:{
    backgroundColor:"#ffff",
    width:"100%",
    height:"30%",
    alignItems:"center",
  },imagenFiltro:{
    marginTop:35,
    width:35,
    height:35,
    position:"absolute",
    right:10
  },busqueda:{
     width:"90%",
     height:"15%",
     borderRadius:15,
     marginTop:35,
     backgroundColor:"#afaeae62"
  },imagenBusqueda:{
    width:25,
    height:25,
    position:"absolute",
    marginLeft:15,
    marginTop:5
  },textoBusquedaTransacciones:{
     fontSize:18,
     marginLeft:60,
     marginTop:6,
     color:"#928888ff"
  },ContenedorDeTiposDetransacciones:{
    width:"100%",
    marginTop:30,
    marginLeft:25
  },tipoDetransaccion:{
    position:"absolute",
    fontSize:19,
    fontWeight:"bold"
  },botones:{
    marginTop:35,
    width:"30%",
    height:30,
    backgroundColor:"#afaeae62",
    borderRadius:15,
    alignItems:"center",
    justifyContent:"center",
    borderWidth:1,
    borderColor:"black"
  }
});
