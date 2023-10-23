import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, useWindowDimensions} from "react-native";
import Logo from '../../assets/naplogo.png';
import { useNavigation } from "@react-navigation/native";

const ForgotPassword = () =>{
  const navigation = useNavigation();
  const {height} = useWindowDimensions();
  const [email, setEmail] = useState('');

  const onSendPressed = () => {
    console.warn("Send Pressed");
    
    navigation.navigate('ChangePassword');
  }

  const onBackPressed = () => {
    console.warn("Back Pressed");

    navigation.navigate("Login");
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
                
                <Text style = {styles.title} > Reset Your Password </Text>

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

                <View style ={styles.formAction}>
                    <TouchableOpacity 
                        onPress={onSendPressed}>
                        <View style = {styles.button}>
                            <Text style = {styles.buttonText}>Send </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style ={styles.formAction}>
                    <TouchableOpacity 
                        onPress={onBackPressed}>
                        <View style = {styles.button2}>
                            <Text style = {styles.buttonText2}>Back to Sign In </Text>
                        </View>
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
    marginBottom: 40,
    textAlign: 'center',
  },

  input:{
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginBottom: 10,
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
    paddingTop: 5,
    paddingBottom: 10,
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

  button2: {
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#1C1C1C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  buttonText2:{
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1C',
  },
});

export default ForgotPassword;