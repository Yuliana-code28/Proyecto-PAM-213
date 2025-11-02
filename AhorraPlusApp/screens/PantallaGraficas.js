import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

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
       <View style={styles.contenedor2}>
           <Text style={styles.contenedorTitulo}>Gastos por Categoría</Text>
           <Text style={styles.dinero}> $2,500</Text>
           <Text >Total de gastos este mes</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5dcb9ff',
  },
  contenedor2:{
   marginTop:50,
   backgroundColor:'#ffffffff',
   justifyContent:"center",
   alignItems:"center",
   marginLeft:"20",
   marginRight:"20",
   borderRadius:14,
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
  }
});
