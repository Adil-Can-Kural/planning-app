import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, TextInput, Button, ImageBackground, Modal, StyleSheet, Platform } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Card, Avatar } from 'react-native-paper';

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

const Schedule = () => {
  const [items, setItems] = useState({});
  const [newPlan, setNewPlan] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [noPlanMessage, setNoPlanMessage] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [planDescription, setPlanDescription] = useState('');
  const [timeError, setTimeError] = useState('');
  const [timeConflict, setTimeConflict] = useState('');

  const loadItemsForMonth = (month) => {
    if (items && Object.keys(items).length > 0) {
      loadItems(month);
    } else {
      setItems({});
    }
  };

  const loadItems = (date) => {
    const day = new Date(date);
    const currentDate = new Date();
    if (day.getTime() >= currentDate.getTime()) {
      for (let i = 0; i < 30; i++) {
        const time = day.getTime() + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!items[strTime]) {
          items[strTime] = [];
        }
      }
      setItems(items);

      if (items[date] && items[date].length === 0) {
        setNoPlanMessage(true);
      } else {
        setNoPlanMessage(false);
      }
    } else {
      setItems({});
    }
  };

  const addItem = (date) => {
    if (newPlan !== '' && startTime !== '' && endTime !== '' && !timeError && !timeConflict) {
      if (!items[date]) {
        items[date] = [];
      }
      items[date].push({
        name: newPlan,
        startTime: startTime,
        endTime: endTime,
        description: planDescription,
        height: 50,
      });
      setItems(items);
      setNewPlan('');
      setStartTime('');
      setEndTime('');
      setPlanDescription('');
      setTimeError('');
      setTimeConflict('');
    }
  };

  useEffect(() => {
    const validateTime = (time) => {
      const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      return regex.test(time);
    };

    if (startTime !== '' && !validateTime(startTime)) {
      setTimeError('Lütfen geçerli bir saat girin.');
    } else {
      setTimeError('');
    }

    if (endTime !== '' && !validateTime(endTime)) {
      setTimeError('Lütfen geçerli bir saat girin.');
    } else {
      setTimeError('');
    }

    if (startTime !== '' && endTime !== '' && startTime >= endTime) {
      setTimeConflict('Başlangıç saati, bitiş saatinden sonra olmamalıdır.');
    } else {
      setTimeConflict('');
    }

    const checkTimeConflicts = () => {
      const currentDateItems = items[timeToString(selectedDate)];
      if (currentDateItems) {
        for (const item of currentDateItems) {
          const start = new Date(`${timeToString(selectedDate)}T${item.startTime}:00Z`);
          const end = new Date(`${timeToString(selectedDate)}T${item.endTime}:00Z`);
         if ((start <= new Date(startTime) && end >= new Date(startTime)) || (start <= new Date(endTime) && end >= new Date(endTime))) {
            setTimeConflict('Aynı anda iki plan olmaz.');
            return true;
          }
        }
      }
      return false;
    };

    if (startTime !== '' && endTime !== '' && checkTimeConflicts()) {
      setTimeConflict('Aynı anda iki plan olmaz.');
    } else {
      setTimeConflict('');
    }
  }, [startTime, endTime]);

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
        <View style={styles.modalBackground}>
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
                placeholder="SS:DD"
                keyboardType="numeric"
              />
              <Text style={{ color: 'red' }}>{timeError}</Text>
              <Text>Plan Bitiş Saati:</Text>
              <TextInput
                style={[styles.input, timeError && { borderColor: 'red' }]}
                onChangeText={(text) => setEndTime(text)}
                value={endTime}
                placeholder="SS:DD"
                keyboardType="numeric"
              />
              <Text style={{ color: 'red' }}>{timeConflict}</Text>
              <Text>Plan Açıklaması:</Text>
              <TextInput
                style={styles.input}
                placeholder="Plan Açıklaması"
                onChangeText={(text) => setPlanDescription(text)}
                value={planDescription}
              />
              <Button
                title="Planı Kaydet"
                onPress={() => {
                  addItem(selectedDate.toISOString().split('T')[0]);
                  setModalVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Agenda
        items={items}
        loadItemsForMonth={loadItemsForMonth}
        selected={selectedDate? selectedDate.toISOString().split('T')[0] : null}
        renderItem={(item) => 
          <ImageBackground source={require('../container/anasayfa.jpeg')} style={{ flex: 1, opacity: 0.5}}>
            <TouchableOpacity style={{ marginRight: 10, marginTop: 17 }}>
              <Card>
                <Card.Content>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text style={{ opacity: 1 }}>{item.name}</Text>
                    <Text style={{ opacity: 1 }}>{item.startTime} - {item.endTime}</Text>
                  </View>
                  <Text style={{ opacity: 1 }}>{item.description}</Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          </ImageBackground>
        }
        onDayPress={(day) => setSelectedDate(day.date)}
        renderEmptyData={() => 
          <ImageBackground source={require('../container/anasayfa.jpeg')} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', opacity : 0.7 }}>
            <Text style={{ fontSize: 25, color: '#000000', fontStyle: 'italic', opacity :1,fontWeight:'bold'}}>Bugün planınız yok :(</Text>
          </ImageBackground>
        }
        locale={'tr'}
      />
      <Button title="PLAN EKLE" onPress={() => setModalVisible(true)} />
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    width: '80%',
  },
  modalContent: {
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    width: '100%',
  },
});

export default Schedule;