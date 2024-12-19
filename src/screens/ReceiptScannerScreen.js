// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
// import QRCodeScanner from 'react-native-qrcode-scanner';
// import { RNCamera } from 'react-native-camera';
// import { useTheme } from '../../context/ThemeContext';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const ReceiptScannerScreen = ({ navigation }) => {
//   const { isDarkMode } = useTheme();
//   const [scanningStatus, setScanningStatus] = useState('');

//   const onScanSuccess = (e) => {
//     try {
//       setScanningStatus('Processing QR Code...');
//       const scannedData = JSON.parse(e.data);

//       if (scannedData && scannedData.amount && scannedData.category) {
//         setScanningStatus('QR Code scanned successfully!');
//         setTimeout(() => {
//           navigation.navigate('Add', {
//             scannedExpense: {
//               amount: scannedData.amount,
//               category: scannedData.category,
//               date: scannedData.date || new Date().toISOString().split('T')[0],
//               description: scannedData.description || 'Scanned QR Code',
//             },
//           });
//         }, 1000);
//       } else {
//         throw new Error('Invalid QR Code data');
//       }
//     } catch (error) {
//       setScanningStatus('');
//       Alert.alert('Error', 'Failed to process QR Code. Please scan a valid QR Code.');
//     }
//   };

//   if (Platform.OS === 'web') {
//     return (
//       <View style={[styles.container, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
//         <Text style={[styles.webText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>QR Code scanning is not available on web. Please use a mobile device.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
//       <QRCodeScanner
//         onRead={onScanSuccess}
//         flashMode={RNCamera.Constants.FlashMode.auto}
//         topContent={
//           <Text style={[styles.instructionText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>Align the QR Code within the frame to scan.</Text>
//         }
//         bottomContent={
//           <Text style={[styles.scanningStatus, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>{scanningStatus}</Text>
//         }
//         showMarker
//         markerStyle={{ borderColor: isDarkMode ? '#FFFFFF' : '#000000' }}
//         cameraStyle={styles.camera}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   camera: {
//     height: '100%',
//     width: '100%',
//   },
//   instructionText: {
//     fontSize: 18,
//     textAlign: 'center',
//     margin: 10,
//   },
//   scanningStatus: {
//     marginTop: 20,
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   webText: {
//     fontSize: 18,
//     textAlign: 'center',
//     padding: 20,
//   },
// });

// export default ReceiptScannerScreen;
