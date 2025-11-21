import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity,Image,ScrollView,TextInput,Alert } from 'react-native';

const flecha = require('../assets/imagen/flec.png');
const maleta = require('../assets/imagen/maleta.png');
const ImagenGrafica = require('../assets/imagen/grafica.png');
const inicio = require('../assets/imagen/casa.png');
const transIcono = require('../assets/imagen/trans.png')
const grafica = require('../assets/imagen/grafico.png');
const perfil = require('../assets/imagen/user.png');
const GraficaIngresoyEgresos = require('../assets/imagen/grafica2.png');


export default function PantallaGraficas() {
  const [activo, setActivo] = useState('gastos');
  const [FechaIncio,setFechaIncio] = useState('');
  const [FechaFin,setFechaFin] = useState('')
  
  const validarFecha = () =>{
      const simbolosFecha = /^\d{4}-\d{2}-\d{2}$/;
      if(simbolosFecha.test(FechaIncio) && simbolosFecha.test(FechaFin)){
        Alert.alert("Fecha Valida","",[{text:"Aceptar"}]);
      }else{
          Alert.alert("Fecha invalida","El formato debe de ser YYYY-MM-DD",[{text:"Deacuerdo"}]);
      }
  }
  return (
    <View style={styles.container}>
      <View style={styles.titulo}>
        <Image style={styles.imagenFlecha} source={flecha}/>
        <Text style={styles.contenedorTitulo}>Gráficas</Text>
        <Image style={styles.imagenMale} source={maleta}/>
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
      { activo === 'gastos' ? ( 
      <ScrollView contentContainerStyle={styles.scrollContenido}>
       <View style={styles.contenedor2}>
           <Text style={styles.tituloGrafica}>Gastos por Categoría</Text>
           <Text style={styles.dinero}> $2,525</Text>
           <Text >Total de gastos este mes</Text>
           <Image source={ImagenGrafica} style={styles.imagen}/>
           <Text style={styles.tituloGrafica}>Ingrese el rango de la Fecha</Text>
          <View style={styles.contenedorFechas}>
          <View style={styles.textoFechas}>
          <Text>Inicio</Text>
           <TextInput style={styles.input}
               placeholder="YYYY-MM-DD"
               value={FechaIncio}
               onChangeText={setFechaIncio}
               keyboardType="numeric"/>
          </View>
          <View style={styles.textoFechas}>
          <Text>Fin</Text>
             <TextInput style={styles.input}
               placeholder="YYYY-MM-DD"
               value={FechaFin}
               onChangeText={setFechaFin}
               keyboardType="numeric"/>
          </View>
          
           </View>
            <TouchableOpacity style={styles.botonFecha} onPress={validarFecha}>
              <Text>Enviar Fecha</Text>
            </TouchableOpacity>
        </View> 
      <View style={styles.contenedorDesglose}>
          <Text style={styles.tituloGrafica}>Desglose Detallado</Text>
          <View style={styles.contenedorGastos}>
               <View style={styles.punto} />
               <Text style={styles.nombre}>Comida</Text>
               <Text style={styles.monto}>$850</Text>
               <Text style={styles.porcentaje}>35%</Text>
          </View>
          <View style={styles.contenedorGastos}>
               <View style={styles.puntoTransporte} />
               <Text style={styles.nombre}>Transporte</Text>
               <Text style={styles.monto}>$400</Text>
               <Text style={styles.porcentaje}>16%</Text>
          </View>
           <View style={styles.contenedorGastos}>
               <View style={styles.puntoEntretenimiento} />
               <Text style={styles.nombre}>Entretenimiento</Text>
               <Text style={styles.monto}>$400</Text>
               <Text style={styles.porcentaje}>16%</Text>
          </View>
          <View style={styles.contenedorGastos}>
               <View style={styles.puntoCompras} />
               <Text style={styles.nombre}>Compras</Text>
               <Text style={styles.monto}>$325</Text>
               <Text style={styles.porcentaje}>13%</Text>
          </View>
          <View style={styles.contenedorGastos}>
               <View style={styles.puntoServicios} />
               <Text style={styles.nombre}>Servicios</Text>
               <Text style={styles.monto}>$300</Text>
               <Text style={styles.porcentaje}>12%</Text>
          </View>
          <View style={styles.contenedorGastos}>
               <View style={styles.puntoOtros} />
               <Text style={styles.nombre}>Otros</Text>
               <Text style={styles.monto}>$300</Text>
               <Text style={styles.porcentaje}>6.0%</Text>
          </View>
      </View>
      </ScrollView>
      ) :(
        <ScrollView contentContainerStyle={styles.scrollContenido}>
       <View style={styles.contenedor2}>
           <Text style={styles.tituloGrafica}>Ingresos vs Gastos</Text>
           <Image source={GraficaIngresoyEgresos} style={styles.imagen}/>
        </View> 
      <View style={styles.contenedorDesglose}>
          <Text style={styles.tituloGrafica}>Desglose Detallado</Text>
          <View style={styles.contenedorGastos}>
               <View style={styles.punto} />
               <Text style={styles.nombre}>Gastos</Text>
               <Text style={styles.monto}>$2,525</Text>
               <Text style={styles.porcentaje}>38.7%</Text>
          </View>
          <View style={styles.contenedorGastos}>
               <View style={styles.puntoServicios} />
               <Text style={styles.nombre}>Ingresos</Text>
               <Text style={styles.monto}>$4,000</Text>
               <Text style={styles.porcentaje}>61.3%</Text>
          </View>
           
      </View>
      </ScrollView>
      )}
      
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
    marginBottom:0,
    textAlign:"center"
  },contenedor3:{
    height: 100,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems:"flex-start",
    flexDirection:"row",
    paddingTop:25,
    paddingLeft:30,
    paddingRight:30
  },navegacion:{
    width:"30%",
    height:"40%",
    resizeMode:"contain"
  },TextoYIcono:{
    flex:1,
    alignItems:"center",
    justifyContent:"center"
  },TextoIcono:{
    fontSize:12,
    marginTop:5,
  },contenedorDesglose:{
    backgroundColor:"#ffffffff",
    flex:1,
    marginLeft:20,
    marginTop:30,
    marginRight:20,
    paddingTop:20,
    borderRadius:20,
    paddingBlockEnd:20,
    paddingEnd:20
  },punto: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    marginRight: 10,
  },
  nombre: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  monto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 10,
  },
  porcentaje: {
    fontSize: 14,
    color: '#888',
  },contenedorGastos:{
    flex:1,
    flexDirection:"row",
    paddingRight:10,
    paddingLeft:20,
    marginTop:20,
    alignItems:"center",
    paddingBlockEnd:10,
  },puntoTransporte:{
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#5bb3d6ff',
    marginRight: 10,
  },puntoEntretenimiento:{
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#bd5bd6ff',
    marginRight: 10,
  },puntoCompras:{
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ecf83eff',
    marginRight: 10,
  },puntoServicios:{
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#27cc66ff',
    marginRight: 10,
  },puntoServicios:{
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#27cc66ff',
    marginRight: 10,
  },puntoOtros:{
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#27cc66ff',
    marginRight: 10,
  },input:{
    width:"90%",
    height:40,
    marginBottom:20,
    borderColor:"black",
    borderWidth:1,
    textAlign:"center"
  },botonFecha:{
    flex:1,
    borderWidth:1,
    borderColor:"black",
    width:"60%",
    height:"50",
    alignItems:"center",
    marginBottom:"40",
    marginTop:20,
    justifyContent:"center",
    borderRadius:15,
    backgroundColor:"#E4B100",
  },contenedorFechas:{
    flex:1,
    marginTop:20,
    flexDirection:"row",
    gap:20,
  },textoFechas:{
    flex:1,
    alignItems:"center",
    marginRight:20,
    marginLeft:20
  },imagenFlecha:{
    width:40,
    height:40,
    position:"absolute",
    left:15,
    marginTop:40
  },imagenMale:{
    width:35,
    height:35,
    position:"absolute",
    marginTop:40,
    right:10,
    marginRight:10
  }
});