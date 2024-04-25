import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, TextInput, Button, ImageBackground} from 'react-native';
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
    if (newPlan !== '') {
      if (!items[date]) {
        items[date] = [];
      }
      items[date].push({ name: newPlan, height: 50 });
      setItems(items);
      setNewPlan('');
    }
  };

  const renderItem = (item) => {
    return (
      <TouchableOpacity style={{ marginRight: 10, marginTop: 17 }}>
        <Card>
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text>{item.name}</Text>
              <Avatar.Text label="J" />
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (selectedDate) {
      loadItems(selectedDate.toISOString().split('T')[0]);
    }
  }, [selectedDate]);

  return (
    <View style={{ flex: 1 }}>
      
      <Agenda
  items={items}
  loadItemsForMonth={loadItemsForMonth}
  selected={selectedDate ? selectedDate.toISOString().split('T')[0] : null}
  renderItem={item => 
    <ImageBackground source={require('../container/anasayfa.jpeg')} style={{ flex: 1 }}>
      <TouchableOpacity style={{ marginRight: 10, marginTop: 17 }}>
        <Card>
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text>{item.name}</Text>
              <Avatar.Text label="J" />
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </ImageBackground>
  }
  onDayPress={(day) => setSelectedDate(day.date)}
  renderEmptyData={() => <ImageBackground source={require('../container/anasayfa.jpeg')} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 25, color: '#000000', fontStyle: 'italic'}}>Bugün planınız yok :(</Text>
    </ImageBackground>
  }
  locale={'tr'}
/>
        <Button title="Add Plan" onPress={() => addItem(selectedDate.toISOString().split('T')[0])} />
      </View>
    
  );
};

export default Schedule;