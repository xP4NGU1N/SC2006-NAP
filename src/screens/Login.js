import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, useWindowDimensions, Switch} from "react-native";
import Logo from '../../assets/naplogo.png';
import { useNavigation } from "@react-navigation/native";
import Checkbox from 'expo-checkbox';

const Login = () =>{
  const navigation = useNavigation();
  const {height} = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
   
  const onSignUpPressed = () => {
    console.warn("Sign Up");

    navigation.navigate('Registration'); 
  }

  const onSignInPressed = () => {
    console.warn("Sign In");

    navigation.navigate('Home');
  }

  const onForgotPressed = () => {
    console.warn("Forgot Password");

    navigation.navigate('ForgotPassword');
  }

  const onRememberPressed = () =>{
    console.warn ("Remember Login Details");
  }
  
  return (
    <SafeAreaView style = {{ flex: 1, backgroundColor: '#e8ecf4'}}>
      <View style = {styles.container}>
        <View style = {styles.header}>
          <Image
            source = {Logo}
            style = {styles.headerImg}
          />
        </View>
                
          <Text style = {styles.title} > Sign In </Text>

        <View style = {styles.form}>
          <View style = {styles.input}>
            <Text style = {styles.inputLabel}> Email Address </Text>

            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType= 'email-address'
              style = {styles.inputControl}
              placeholder = 'Email'
              placeholderTextColor = '#6b7280'
              value = {email}
              onChangeText={newEmail => setEmail(newEmail)}
            />
          </View>

          <View style = {styles.input}>
            <Text style = {styles.inputLabel}> Password </Text>

            <TextInput
              secureTextEntry
              style = {styles.inputControl}
              placeholder = 'Password'
              placeholderTextColor = '#6b7280'
              value = {password}
              onChangeText={newpassword => setPassword(newpassword)}
            />
          </View>

          <View style = {styles.checkboxContainer}>
            <Checkbox
              disabled = {false}
              value = {toggleCheckBox}
              onValueChange={(newValue) => setToggleCheckBox(newValue)}
              onPress = {onRememberPressed}
            />
              <Text style = {styles.checkboxText}> Remember Me </Text>
          </View>
          

          <View style ={styles.formAction}>
            <TouchableOpacity 
              onPress={onSignInPressed}>
              <View style = {styles.button}>
                <Text style = {styles.buttonText}>Sign In </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style = {styles.forgetPassword}>
            <TouchableOpacity onPress={onForgotPressed}>
              <View style = {styles.button}>
                <Text style = {styles.buttonText}>Forgot Password? </Text>
              </View>
            </TouchableOpacity>
          </View>

            <View style = {styles.formFooter}> 
              <Text style = {styles.bottomtext}>Don't have an account?{' '}</Text>
              <TouchableOpacity 
                //style={{marginTop : 'auto'}}
                onPress={onSignUpPressed}>
                  <Text style = {styles.signUp}>
                    Sign up!
                  </Text>
              </TouchableOpacity>
            </View>

        </View>         
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
  },

  header: {
    marginVertical: 36
  },

  headerImg: {
    width: 400,
    height: 150,
    alignSelf: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e1e1e',
    marginBottom: 20,
    textAlign: 'center',
  },

  input:{
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginBottom: 10
  },
  inputControl: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    fontWeight: '500',
    color: '#222',
  },
   
  form: {
    marginBottom: 24,
    flex: 1,
  },

  formAction: {
    marginVertical: 24,
  },

  formFooter: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 30,
  },

  button: {
    backgroundColor: '#1C1C1C',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#1C1C1C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  buttonText:{
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },

  signUp:{
    fontSize : 18,
    color: 'blue',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  bottomtext:{
    fontSize: 18,
    fontWeight: '600',
  },

  forgetPassword:{

  },

  checkboxContainer: {
    flexDirection : 'row',
    alignItems: 'center',
  },

  checkboxText : {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },
});

export default Login;