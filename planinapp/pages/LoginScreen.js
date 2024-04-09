import React, { useState } from 'react';
import {
  View,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { Input, Button as RNEButton } from 'react-native-elements';
import { Link } from 'expo-router';
import firebase from '../firebaseConfig.js'; // Import your firebaseConfig.js
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth(firebase);

const AuthScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log('User logged in:', user);
    
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('Error logging in:', errorCode, errorMessage);
    
    });
  };

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password,name)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      console.log('User registered:', user);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log('Error registering:', errorCode, errorMessage);
      // ...
    });
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
                <Link href={"./homepage"} replace={true}>
                  <RNEButton
                    title= "Giriş Yap"
                    onPress={handleLogin}
                    buttonStyle={{ backgroundColor: 'green' }}
                  />
                </Link>
            
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
