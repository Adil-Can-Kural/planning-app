import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, TextInput, Button, ImageBackground, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Card } from 'react-native-paper';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, Timestamp } from "firebase/firestore";
import { db, auth } from '../firebaseConfig.js';
import { Ionicons } from '@expo/vector-icons';
import { signOut, deleteUser } from "firebase/auth";

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const Schedule = () => {
  const [items, setItems] = useState({});
  const [newPlan, setNewPlan] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [timeError, setTimeError] = useState('');
  const [timeConflict, setTimeConflict] = useState('');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(require('../container/anasayfa.jpeg'));
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planModalVisible, setPlanModalVisible] = useState(false);

  const fetchPlans = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Plans"));
      const plans = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.date) {
          const strTime = timeToString(data.date.toDate());
          if (!plans[strTime]) {
            plans[strTime] = [];
          }
          plans[strTime].push({
            id: doc.id,
            name: data.name,
            startTime: data.startTime,
            endTime: data.endTime,
            description: data.description,
            height: 50,
          });
        } else {
          console.error("Document is missing 'date' field:", doc.id);
        }
      });
      setItems(plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const loadItemsForMonth = (month) => {
    setTimeout(() => {
      const newItems = {};
      Object.keys(items).forEach(key => { newItems[key] = items[key]; });
      setItems(newItems);
    }, 1000);
  };

  const addItem = async (date) => {
    if (
      newPlan !== '' &&
      startTime !== '' &&
      endTime !== '' &&
      !timeError &&
      !timeConflict
    ) {
      const planData = {
        name: newPlan,
        startTime: startTime,
        endTime: endTime,
        description: planDescription,
        date: Timestamp.fromDate(selectedDate)
      };

      try {
        const docRef = await addDoc(collection(db, 'Plans'), planData);
        console.log('Document written with ID:', docRef.id);

        if (!items[date]) {
          items[date] = [];
        }
        items[date].push({
          ...planData,
          id: docRef.id,
          height: 50,
        });
        setItems({ ...items });

        setNewPlan('');
        setStartTime('');
        setEndTime('');
        setPlanDescription('');
        setTimeError('');
        setTimeConflict('');
      } catch (error) {
        console.error('Error adding document:', error);
      }
    }
  };

  useEffect(() => {
    const validateTime = (time) => {
      const regex = /^([0-1]?[0-9]|2[0-3])[:.]([0-5][0-9])$/;
      return regex.test(time);
    };

    if (startTime !== '' && !validateTime(startTime)) {
      setTimeError('Lütfen geçerli bir saat girin. (SS:DD veya SS.DD');
    } else {
      setTimeError('');
    }

    if (endTime !== '' && !validateTime(endTime)) {
      setTimeError('Lütfen geçerli bir saat girin. (SS:DD veya SS.DD)');
    } else {
      setTimeError('');
    }

    if (startTime !== '' && endTime !== '' && startTime.replace('.', ':') >= endTime.replace('.', ':')) {
      setTimeConflict('Başlangıç saati, bitiş saatinden sonra veya eşit olmamalıdır.');
    } else {
      setTimeConflict('');
    }

    const checkTimeConflicts = () => {
      const currentDateItems = items[timeToString(selectedDate)];
      if (currentDateItems) {
        for (const item of currentDateItems) {
          const start = new Date(`${timeToString(selectedDate)}T${item.startTime.replace('.', ':')}:00`);
          const end = new Date(`${timeToString(selectedDate)}T${item.endTime.replace('.', ':')}:00`);
          if ((new Date(`${timeToString(selectedDate)}T${startTime.replace('.', ':')}:00`) < end && new Date(`${timeToString(selectedDate)}T${endTime.replace('.', ':')}:00`) > start)) {
            setTimeConflict('Aynı anda iki plan olmaz.');
            return true;
          }
        }
      }
      return false;
    };

    if (startTime !== '' && endTime !== '' && !timeConflict && checkTimeConflicts()) {
      setTimeConflict('Aynı anda iki plan olmaz.');
    } else if (timeConflict !== 'Aynı anda iki plan olmaz.') {
      setTimeConflict('');
    }
  }, [startTime, endTime]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User signed out!');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };
  
  const handleDeleteAccount = () => {
    if (auth.currentUser) {
      deleteUser(auth.currentUser)
        .then(() => {
          console.log('User account deleted!');
        })
        .catch((error) => {
          console.error('Error deleting account:', error);
        });
    } else {
      console.error('No user is currently signed in.');
    }
  };
  

  const handleChangeBackground = () => {
    console.log('Change background function called');
  };

  const handleDeletePlan = async (planId, date) => {
    try {
      await deleteDoc(doc(db, 'Plans', planId));
      const updatedItems = { ...items };
      updatedItems[date] = updatedItems[date].filter(item => item.id !== planId);
      setItems(updatedItems);
      setPlanModalVisible(false);
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const handleUpdatePlan = async (planId, updatedData, date) => {
    try {
      const planRef = doc(db, 'Plans', planId);
      await updateDoc(planRef, updatedData);
      const updatedItems = { ...items };
      const itemIndex = updatedItems[date].findIndex(item => item.id === planId);
      if (itemIndex > -1) {
        updatedItems[date][itemIndex] = { ...updatedItems[date][itemIndex], ...updatedData };
        setItems(updatedItems);
        setPlanModalVisible(false);
      }
    } catch (error) {
      console.error('Error updating plan:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        style={styles.modal}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text>Plan Adı:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => setNewPlan(text)}
                    value={newPlan}
                  />
                  <Text>Plan Başlangıç Saati:</Text>
                  <TextInput
                    style={[styles.input, timeError && { borderColor: 'red' }]}
                    onChangeText={(text) => setStartTime(text)}
                    value={startTime}
                    placeholder="HH:MM veya HH.MM"
                    keyboardType="numeric"
                  />
                  <Text style={{ color: 'red' }}>{timeError}</Text>
                  <Text>Plan Bitiş Saati:</Text>
                  <TextInput
                    style={[styles.input, timeConflict && { borderColor: 'red' }]}
                    onChangeText={(text) => setEndTime(text)}
                    value={endTime}
                    placeholder="HH:MM veya HH.MM"
                    keyboardType="numeric"
                  />
                  <Text style={{ color: 'red' }}>{timeConflict}</Text>
                  <Text>Plan Açıklaması:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => setPlanDescription(text)}
                    value={planDescription}
                  />
                </View>
                <Button title="Ekle" onPress={() => {
                  addItem(timeToString(selectedDate));
                  setModalVisible(false);
                }} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsVisible}
        onRequestClose={() => {
          setSettingsVisible(!settingsVisible);
        }}
        style={styles.modal}
      >
        <TouchableWithoutFeedback onPress={() => setSettingsVisible(false)}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContainer}>
                <Button title="Çıkış Yap" onPress={handleLogout} />
                <Button title="Hesabı Sil" onPress={handleDeleteAccount} />
                <Button title="Arka Planı Değiştir" onPress={handleChangeBackground} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={planModalVisible}
        onRequestClose={() => {
          setPlanModalVisible(!planModalVisible);
        }}
        style={styles.modal}
      >
        <TouchableWithoutFeedback onPress={() => setPlanModalVisible(false)}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContainer}>
                <Text>Plan Adı: {selectedPlan?.name}</Text>
                <Text>Başlangıç Saati: {selectedPlan?.startTime}</Text>
                <Text>Bitiş Saati: {selectedPlan?.endTime}</Text>
                <Text>Açıklama: {selectedPlan?.description}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Plan Adı"
                  value={selectedPlan?.name || ''}
                  onChangeText={(text) => setSelectedPlan({ ...selectedPlan, name: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Başlangıç Saati"
                  value={selectedPlan?.startTime || ''}
                  onChangeText={(text) => setSelectedPlan({ ...selectedPlan, startTime: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Bitiş Saati"
                  value={selectedPlan?.endTime || ''}
                  onChangeText={(text) => setSelectedPlan({ ...selectedPlan, endTime: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Açıklama"
                  value={selectedPlan?.description || ''}
                  onChangeText={(text) => setSelectedPlan({ ...selectedPlan, description: text })}
                />
                <Button title="Planı Güncelle" onPress={() => {
                  const updatedData = {
                    name: selectedPlan?.name,
                    startTime: selectedPlan?.startTime,
                    endTime: selectedPlan?.endTime,
                    description: selectedPlan?.description,
                  };
                  handleUpdatePlan(selectedPlan.id, updatedData, timeToString(selectedDate));
                }} />
                <Button title="Planı Sil" onPress={() => handleDeletePlan(selectedPlan.id, timeToString(selectedDate))} />
                <Button title="Kapat" onPress={() => setPlanModalVisible(false)} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <ImageBackground source={backgroundImage} style={{ flex: 1 }}>
        <Agenda
          items={items}
          loadItemsForMonth={loadItemsForMonth}
          selected={selectedDate ? selectedDate.toISOString().split('T')[0] : null}
          renderItem={(item) => (
            <TouchableOpacity onPress={() => {
              setSelectedPlan(item);
              setPlanModalVisible(true);
            }}>
              <Card style={{ marginRight: 10, marginTop: 17 }}>
                <Card.Content>
                  <View>
                    <Text>{item.name}</Text>
                    <Text>{item.description}</Text>
                    <Text>{item.startTime} - {item.endTime}</Text>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          )}
          onDayPress={(day) => setSelectedDate(new Date(day.timestamp))}
          renderEmptyDate={() => (
            <View style={styles.emptyDate}>
              <Text>Bugün Planınız Yok :(</Text>
            </View>
          )}
          showClosingKnob={true}
        />
      </ImageBackground>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add-circle" size={80} color="#004d40" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => setSettingsVisible(true)}
      >
        <Ionicons name="settings" size={40} color="#004d40" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalContent: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  settingsButton: {
    position: 'absolute',
    bottom: 30,
    left: 30,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
});

export default Schedule;
