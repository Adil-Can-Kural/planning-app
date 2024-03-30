import React, { useState } from 'react';
import {
  View,
  ScrollView,
  ImageBackground,
  TextInput,
  Button,
  Image,
} from 'react-native';
import { Input, Button as RNEButton } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';


const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const navigation = useNavigation();
  const handleLogin = () => {
    // Login logic here (e.g., authenticate with backend)
    // Giriş işlemleri için arka ucunuza veya veritabanınıza bağlantı kurun
    navigation.navigate('HomePage')
  };

  const handleRegister = () => {
    // Registration logic here (e.g., send data to Firebase)
    // Kayıt işlemleri için arka ucunuza veya veritabanınıza bağlantı kurun
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };  

  return (
    <ScrollView>
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={require('../container/login.jpeg')} 
          style={{ flex: 1, resizeMode: 'cover' }}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 500 }}>
            {isLogin ? (
              <>
                <Input
                  placeholder="Kullanıcı Adı"
                  onChangeText={(text) => setEmail(text)}
                  value={email}
                  style={{ backgroundColor: 'lightblue', color: 'black', fontSize: 16, borderColor: 'blue' }}
                />
                <Input
                  placeholder="Şifre"
                  secureTextEntry={true}
                  onChangeText={(text) => setPassword(text)}
                  value={password}
                  style={{ backgroundColor: 'lightblue', color: 'black', fontSize: 20, borderColor: 'blue' }}
                />
                <RNEButton
                  title="Giriş Yap"
                  onPress={handleLogin}
                  buttonStyle={{ backgroundColor: 'green' }}
                />
                <RNEButton
                  title="Kayıt Ol"
                  onPress={toggleAuthMode}
                  buttonStyle={{ backgroundColor: '#000000', marginTop: 10 }}
                />
              </>
            ) : (
              <>
              <Input
              placeholder="Kullanıcı Adı"
              onChangeText={(text) => setEmail(text)}
              value={email}
              style={{ backgroundColor: 'lightblue', color: 'black', fontSize: 16, borderColor: 'blue' }}
            />
                <Input
                  placeholder="Ad Soyad"
                  onChangeText={(text) => setName(text)}
                  value={name}
                  style={{ backgroundColor: 'lightblue', color: 'black', fontSize: 16, borderColor: 'blue' }}
                />
                <Input
                  placeholder="E-posta"
                  onChangeText={(text) => setEmail(text)}
                  value={email}
                  style={{ backgroundColor: 'lightblue', color: 'black', fontSize: 16, borderColor: 'blue', marginBottom: 10 }}
                />
                <Input
                  placeholder="Şifre"
                  secureTextEntry={true}
                  onChangeText={(text) => setPassword(text)}
                  value={password}
                  style={{ backgroundColor: 'lightblue', color: 'black', fontSize: 20, borderColor: 'blue' }}
                />
                <RNEButton
                  title="Kayıt Ol"
                  onPress={handleRegister}
                  buttonStyle={{ backgroundColor: 'green' }}
                />
                <RNEButton
                  title="Giriş Yap"
                  onPress={toggleAuthMode}
                  buttonStyle={{ backgroundColor: '#000000', marginTop: 10 }}
                />
              </>
            )}
          </View>
        </ImageBackground>
      </View>
    </ScrollView>
  );
};

export default AuthScreen;
