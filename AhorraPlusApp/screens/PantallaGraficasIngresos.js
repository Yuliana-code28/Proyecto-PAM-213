import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { PieChart } from "react-native-chart-kit";
import { useFocusEffect } from '@react-navigation/native';
import TransactionController from '../controllers/TransactionController';
import UserController from "../controllers/UserController";
 
const maleta = require('../assets/imagen/maleta.png');

const coloresTipos = {
  Gastos: "#EF4444", 
  Ingresos: "#22C55E" 
};

export default function PantallaGraficasIngresos({ navigation }) {
  const [transactions, setTransactions] = useState([]);
  const [userId, setUserId] = useState(null);
  const [activo, setActivo] = useState('ingresos');

  useEffect(() => {
    const loadUser = async () => {
      const user = await UserController.getLoggedUser();
      if (user) setUserId(user.id);
    };
    loadUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchTransactions = async () => {
        if (!userId) return;
        const data = await TransactionController.getAll(userId);
        setTransactions(data);
      };
      fetchTransactions();
    }, [userId])
  );

  const totalGastos = transactions
    .filter(t => t.tipo.toLowerCase().trim() === 'gasto')
    .reduce((suma, t) => suma + parseFloat(t.monto), 0);

  const totalIngresos = transactions
    .filter(t => t.tipo.toLowerCase().trim() === 'ingreso')
    .reduce((suma, t) => suma + parseFloat(t.monto), 0);

  const balance = totalIngresos - totalGastos;

  const datos = [
    { 
      name: "Gastos", 
      monto: totalGastos, 
      color: coloresTipos.Gastos, 
      legendFontColor: "#7F7F7F", 
      legendFontSize: 15 
    },
    { 
      name: "Ingresos", 
      monto: totalIngresos, 
      color: coloresTipos.Ingresos, 
      legendFontColor: "#7F7F7F", 
      legendFontSize: 15 
    }
  ];

  const datosGrafica = datos.filter(d => d.monto > 0);
  const totalFlujo = totalGastos + totalIngresos;

  const porcentaje = datos.map(item => ({
    ...item,
    porcentaje: totalFlujo > 0 ? ((item.monto / totalFlujo) * 100).toFixed(1) : 0
  }));

  const formatMoney = (amount) => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  return (
    <View style={styles.container}>
   
      <View style={styles.titulo}>
        <Text style={styles.contenedorTitulo}>Gráficas</Text>
        <Image style={styles.imagenMale} source={maleta} />
        
        <View style={styles.pestanas}>
          <TouchableOpacity
            style={[styles.boton, activo === 'gastos' && styles.activo]}
            onPress={() => navigation.navigate('Graficas')}
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
          <Text style={styles.tituloGrafica}>Ingresos vs Gastos</Text>
          <Text style={[styles.dinero, { color: balance >= 0 ? '#22C55E' : '#EF4444' }]}>
            {formatMoney(balance)}
          </Text>
          <Text style={{color: '#555'}}>Balance Neto</Text>

          {totalFlujo > 0 ? (
            <PieChart
              data={datosGrafica}
              width={350}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor={'monto'}
              backgroundColor={'transparent'}
              paddingLeft={"15"}
              center={[10, 0]}
              hasLegend={false}
            />
          ) : (
            <Text style={{marginTop: 20, color: '#777'}}>No hay datos suficientes</Text>
          )}
        </View>

        <View style={styles.contenedorDesglose}>
          <Text style={[styles.tituloGrafica, { marginBottom: 15 }]}>Desglose Detallado</Text>

          {porcentaje.map((item, index) => (
            <View key={index} style={styles.contendorPorcentaje}>
              <View style={[styles.puntoOtros, { backgroundColor: item.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.textoPorcetaje}>{item.name}</Text>
              </View>
              <Text style={[styles.Textoporcentajes, styles.textoDinero]}>{formatMoney(item.monto)}</Text>
              <Text style={styles.Textoporcentajes}>{item.porcentaje}%</Text>
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
    flexGrow: 1,
    paddingBottom: 40,
  },

  titulo: {
    width: '100%',
    backgroundColor: '#fff',
    height: '20%',
    paddingTop: 20,
    alignItems: 'center',
  },
  contenedorTitulo: {
    marginTop: 20,
    marginBottom: 30,
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  imagenMale: {
    width: 35,
    height: 35,
    position: "absolute",
    right: 10,
    marginTop: 40,
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
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingTop: 10,
    alignItems: "center",
  },
  tituloGrafica: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  dinero: {
    fontSize: 30,
    color: "#E4B100",
    padding: 10,
  },

 
  contenedorDesglose: {
    marginTop: 30,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  contendorPorcentaje: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    marginTop: 10,
  },
  puntoOtros: {
    width: 15,
    height: 15,
    borderRadius: 6,
    marginRight: 10,
  },
  textoPorcetaje: {
    fontSize: 17,
  },
  Textoporcentajes: {
    fontSize: 16,
    color: "#5c5c5cff",
  },
  textoDinero: {
    fontWeight: "bold",
    paddingRight: 10,
  },
});
