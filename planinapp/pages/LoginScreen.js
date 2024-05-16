import React, { useState } from 'react';
import {
  View,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Input, Button as RNEButton } from 'react-native-elements';
import firebase from '../firebaseConfig.js'; // Import your firebaseConfig.js
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const auth = getAuth(firebase);
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 16;

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleLogin = async () => {
    if (!email ||!password) {
      alert('Please fill in all fields.');
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
      alert('Password must be between 6 and 16 characters long.');
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Plan'); // Navigate to Plan on successful login
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in. Please try again.');
    }
  };

  const handleRegister = async () => {
    if (!email ||!password ||!name) {
      alert('Please fill in all fields.');
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
      alert('Password must be between 6 and 16 characters long.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(auth.currentUser);
      alert('User registered successfully. Please check your email to verify your account.');
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Error registering user. Please try again.');
    }
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
                  placeholder="E-mail"
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
                  placeholder="E-mail"
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
