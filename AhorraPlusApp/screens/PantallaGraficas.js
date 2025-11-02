import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity,Image,ScrollView } from 'react-native';

const ImagenGrafica = require('../assets/imagen/grafica.png');
const inicio = require('../assets/imagen/house.png');
const transaciones = require('../assets/imagen/dollar.png');
const grafica = require('../assets/imagen/stats.png');
const perfil = require('../assets/imagen/user.png');

export default function PantallaGraficas() {
  const [activo, setActivo] = useState('gastos');

  return (
    <View style={styles.container}>
      <View style={styles.titulo}>
        <Text style={styles.contenedorTitulo}>Gráficas</Text>

        <View style={styles.pestanas}>
          <TouchableOpacity
            style={[styles.boton, activo === 'gastos' && styles.activo]}
            onPress={() => setActivo('gastos')}
          >
            <Text style={[styles.textoBoton, activo === 'gastos' && styles.textoActivo]}>
              Gastos por Categoría
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.boton, activo === 'ingresos' && styles.activo]}
            onPress={() => setActivo('ingresos')}
          >
            <Text style={[styles.textoBoton, activo === 'ingresos' && styles.textoActivo]}>
              Ingresos vs Gastos
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContenido}>
       <View style={styles.contenedor2}>
           <Text style={styles.tituloGrafica}>Gastos por Categoría</Text>
           <Text style={styles.dinero}> $2,500</Text>
           <Text >Total de gastos este mes</Text>
           <Image source={ImagenGrafica} style={styles.imagen}/>
        </View>
        
      </ScrollView>
      <View style={styles.contenedor3}>
         <Image source={inicio} style={styles.navegacion}/>
         <Image source={transaciones} style={styles.navegacion}/>
         <Image source={grafica} style={styles.navegacion}/>
         <Image source={perfil} style={styles.navegacion}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5dcb9ff',
  },scrollContenido: {
    paddingBottom: 40, 
    flexGrow:1
  },
  contenedor2:{
   marginTop:40,
   backgroundColor:'#ffffffff',
   justifyContent:"center",
   alignItems:"center",
   marginLeft:20,
   marginRight:20,
   borderRadius:14,
   paddingTop:10,
   justifyContent:"flex-start",
  },
  titulo: {
    width: '100%',
    backgroundColor: '#ffffffff',
    height: '20%',
    paddingTop: 20,
    alignItems: 'center',
},
  contenedorTitulo: {
    marginTop:20,
    color: '#000000ff',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  pestanas: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    borderRadius: 25,
    padding: 5,
    width: '90%',
    justifyContent: 'space-between',
  },
  boton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  activo: {
    backgroundColor: '#E4B100',
  },
  textoBoton: {
    fontSize: 14,
    color: '#555',
  },
  textoActivo: {
    color: '#fff',
    fontWeight: 'bold',
  },dinero:{
    color:"#E4B100",
    fontSize:30,
    padding:10
  },imagen:{
    marginTop:20,
    width:"90%",
    height:300,
    resizeMode:"contain",
    marginBottom:20
  },tituloGrafica:{
    fontSize:20,
    fontWeight:"bold",
    marginBottom:0
  },contenedor3:{
    height: 100,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems:"flex-start",
    flexDirection:"row",
    paddingTop:40,
    paddingLeft:30,
    paddingRight:30
  },navegacion:{
    width:"30%",
    height:"40%",
    resizeMode:"contain"
  }
});
