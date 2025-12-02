import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function PagarScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [montoPago, setMontoPago] = useState('');
  const [referenciaPago, setReferenciaPago] = useState('');
  const [descripcionPago, setDescripcionPago] = useState('');

  const guardarPago = () => {
    if (!montoPago || !referenciaPago) {
      Alert.alert('Error', 'Por favor completa monto y referencia');
      return;
    }
    Alert.alert('Éxito', `Pago registrado: $${montoPago} con referencia ${referenciaPago}`);
    setModalVisible(false);
    setMontoPago('');
    setReferenciaPago('');
    setDescripcionPago('');
  };

  return (
    <View style={styles.main}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Flecha de regresar */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 16 }}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>

        {/* Título */}
        <View style={styles.header}>
          <Text style={styles.titulo}>Pagar</Text>
        </View>

        {/* Lista estilo transacciones */}
        <View style={styles.transZona}>
          <Text style={styles.mensajeVacio}>Aún no hay pagos registrados</Text>
        </View>

        {/* Botón agregar */}
        <TouchableOpacity style={styles.botonAgregar} onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={22} color="#000" />
          <Text style={styles.botonTexto}>Realizar pago</Text>
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
            <Text style={styles.modalTitulo}>Nuevo Pago</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Monto"
              keyboardType="numeric"
              value={montoPago}
              onChangeText={setMontoPago}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Referencia"
              value={referenciaPago}
              onChangeText={setReferenciaPago}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Descripción (opcional)"
              value={descripcionPago}
              onChangeText={setDescripcionPago}
            />

            <View style={styles.modalBotones}>
              <TouchableOpacity style={[styles.botonBase, styles.botonCancelar]} onPress={() => setModalVisible(false)}>
                <Text style={styles.botonCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.botonBase, styles.botonGuardar]} onPress={guardarPago}>
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
  botonTexto: { 
    marginLeft: 8, 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#000' 
    },
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
});
