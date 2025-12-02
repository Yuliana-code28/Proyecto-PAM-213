import React, { useState } from 'react';
import { 
  Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, 
  TextInput, Alert 
} from 'react-native';

import { PieChart } from "react-native-chart-kit";


const flecha = require('../assets/imagen/flec.png');
const maleta = require('../assets/imagen/maleta.png');


const datos = [
  { 
    name: "Comida",
    monto: 140,
    dinero:"1100",
    color: "#4fe665ff",

  },
  { 
    name: "Transporte",
    monto: 120,
    dinero:"900",
    color: "#00c8ffff",
  },
];

const total = datos.reduce((suma,item)=> suma + item.monto,0);

const porcentaje = datos.map((item)=>({
  ...item, porcentaje:((item.monto/total)).toFixed(3)
}))

export default function PantallaGraficas ({navigation}) {
  const [activo, setActivo] = useState('gastos');
  const [FechaIncio, setFechaIncio] = useState('');
  const [FechaFin, setFechaFin] = useState('');

  const validarFecha = () => {
    const simbolosFecha = /^\d{4}-\d{2}-\d{2}$/;
    if (simbolosFecha.test(FechaIncio) && simbolosFecha.test(FechaFin)) {
      Alert.alert("Fecha Valida", "", [{ text: "Aceptar" }]);
    } else {
      Alert.alert("Fecha invalida", "El formato debe ser YYYY-MM-DD", [{ text: "De acuerdo" }]);
    }
  };

  return (
    <View style={styles.container}>

      
      <View style={styles.titulo}>
       
        <Text style={styles.contenedorTitulo}>Gráficas</Text>
        <Image style={styles.imagenMale} source={maleta} />

      
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
            onPress={() => navigation.navigate('GraficasIngresos')}
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
            <Text style={styles.dinero}>$2,525</Text>
            <Text>Total de gastos este mes</Text>

            <PieChart
              data={datos}
              width={300}
              height={300}
              paddingLeft={80}
              accessor={'monto'}
              backgroundColor={'transparent'}
              chartConfig={{
                color: () => "#ffff"
              }}
              hasLegend={false}
            />
          </View>

          
          <View style={styles.contenedorDesglose}>
            <Text style={[styles.tituloGrafica, {marginBottom:15}]}>Desglose Detallado</Text>

             {porcentaje.map((item,index)=> (
              <View key={index} style={styles.contendorPorcentaje}>
              <View style={[styles.puntoOtros,{backgroundColor:item.color}]}/>
              <View style={{flex:1}}> 
              <Text  style={styles.textoPorcetaje}>{item.name}</Text>
              </View>
              <Text style={[styles.Textoporcentajes,styles.textoDinero]}>${item.dinero}</Text>
              <Text style={styles.Textoporcentajes}>{item.porcentaje*100}%</Text>
              </View>
             ))}

           
          </View>
        </ScrollView>
      

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

  titulo: {
    width: '100%',
    backgroundColor: '#fff',
    height: '20%',
    paddingTop: 20,
    alignItems: 'center',
  },

  imagenFlecha: {
    width: 40,
    height: 40,
    position: "absolute",
    left: 15,
    marginTop: 40
  },

  imagenMale: {
    width: 35,
    height: 35,
    position: "absolute",
    right: 10,
    marginTop: 40
  },

  contenedorTitulo: {
    marginTop: 20,
    color: '#000',
    fontSize: 20,
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
  },

  contenedor2: {
    marginTop: 40,
    backgroundColor: '#fff',
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 14,
    paddingTop: 10,
  },

  tituloGrafica: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center"
  },

  dinero: {
    color: "#E4B100",
    fontSize: 30,
    padding: 10
  },

  contenedorDesglose: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 30,
    padding: 20,
    borderRadius: 20,
  },

  puntoOtros: {
    width: 15,
    height: 15,
    borderRadius: 6,
    marginRight: 10,
  },

  contendorPorcentaje:{
    marginTop:10,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },

  textoPorcetaje:{
    fontSize:17
  },
  Textoporcentajes:{
    fontSize:16,
    color:"#5c5c5cff",
  },textoDinero:{
    paddingRight:10,
    fontWeight:"bold"
  }
});
