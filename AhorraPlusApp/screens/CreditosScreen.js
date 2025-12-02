import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CreditosScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [nombreCredito, setNombreCredito] = useState('');
  const [montoCredito, setMontoCredito] = useState('');
  const [creditos, setCreditos] = useState([]);


  const guardarCredito = () => {
    if (!nombreCredito || !montoCredito) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const nuevoCredito = {
      id: Date.now(), // identificador único
      nombre: nombreCredito,
      monto: montoCredito,
      fecha: new Date().toLocaleDateString(), // fecha actual
    };
    setCreditos([...creditos, nuevoCredito]);

    Alert.alert('Éxito', `Crédito agregado: ${nombreCredito} por $${montoCredito}`);
    setModalVisible(false);
    setNombreCredito('');
    setMontoCredito('');
  };

  return (
    <View style={styles.main}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 16 }}>
            <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>

        {/* Título */}
        <View style={styles.header}>
          <Text style={styles.titulo}>Créditos</Text>
        </View>

        {/* Lista transacciones */}
        <View style={styles.transZona}>
          {creditos.length === 0 ? (
          <Text style={styles.mensajeVacio}>Aún no hay créditos</Text>
          ) : (
          creditos.map((credito) => (
          <TouchableOpacity key={credito.id} style={styles.transaccion}>
          <View style={[styles.transIconoContainer, { backgroundColor: '#DCFCE7' }]}>
            <Ionicons name="cash-outline" size={22} color="#22C55E" />
          </View>
          <View style={styles.transDetalles}>
            <Text style={styles.transNombre}>{credito.nombre}</Text>
            <Text style={styles.transCategoria}>Monto: ${credito.monto}</Text>
          </View>
          <View style={styles.transCantidadContainer}>
            <Text style={styles.transFecha}>{credito.fecha}</Text>
          </View>
        </TouchableOpacity>
        ))
        )}
      </View>


        {/* Botón agregar */}
        <TouchableOpacity style={styles.botonAgregar} onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={22} color="#000" />
          <Text style={styles.botonTexto}>Agregar crédito</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Modal flotante */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContenedor}>
          <View style={styles.modalVista}>
            <Text style={styles.modalTitulo}>Nuevo Crédito</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Nombre del crédito"
              value={nombreCredito}
              onChangeText={setNombreCredito}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Monto"
              keyboardType="numeric"
              value={montoCredito}
              onChangeText={setMontoCredito}
            />

            <View style={styles.modalBotones}>
              <TouchableOpacity style={[styles.botonBase, styles.botonCancelar]} onPress={() => setModalVisible(false)}>
                <Text style={styles.botonCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.botonBase, styles.botonGuardar]} onPress={guardarCredito}>
                <Text style={styles.botonGuardarTexto}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  main: { 
    flex: 1, 
    backgroundColor: '#e5dcb9ff' 
    },
  container: { 
    marginTop: 20,
    marginBottom: 20,
    flexGrow: 1, 
    padding: 20 
 },
  header: { 
    marginBottom: 16 
  },
  titulo: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#000000ff' 
  },
  transZona: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 20,
    elevation: 4,
    marginBottom: 20,
  },
  mensajeVacio: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },

  botonAgregar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d8c242ff',
    paddingVertical: 14,
    borderRadius: 10,
    elevation: 4,
  },
  botonTexto: { marginLeft: 8, fontSize: 16, fontWeight: 'bold', color: '#000' },

  modalContenedor: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
    },
  modalVista: { 
    width: '90%', 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 20, 
    elevation: 5 
  },
  modalTitulo: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 16 
    },
  modalInput: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    paddingHorizontal: 10, 
    marginBottom: 12, 
    height: 45 
    },
  modalBotones: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
    },
  botonBase: { 
    flex: 1, 
    paddingVertical: 12, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginHorizontal: 5 
  },
  botonGuardar: { 
    backgroundColor: '#d8c242ff' 
  },
  botonGuardarTexto: { 
    color: '#000', 
    fontWeight: 'bold' 
  },
  botonCancelar: { 
    backgroundColor: '#f3f4f6', 
    borderWidth: 1, 
    borderColor: '#ccc' 
  },
  botonCancelarTexto: { 
    color: '#333', 
    fontWeight: 'bold' 
 },
 transaccion: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#F0F0F0',
},
transIconoContainer: {
  width: 44,
  height: 44,
  borderRadius: 22,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
},
transDetalles: { 
  flex: 1 
  },
transNombre: { 
  fontSize: 16, 
  fontWeight: 'bold', 
  color: '#000' 
  },
transCategoria: { 
  fontSize: 14, 
  color: '#777' 
  },
transCantidadContainer: { 
  alignItems: 'flex-end' 
  },
transFecha: { 
  fontSize: 12, 
  color: '#999', 
  marginTop: 2 
  },

});
