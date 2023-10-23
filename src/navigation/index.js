import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import {View, Text} from 'react-native'
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from '../screens/Login';
import Registration from "../screens/Registration";
import Home from "../screens/Home";
import ForgotPassword from "../screens/ForgotPassword";
import ChangePassword from "../screens/ChangePassword";

const Stack = createNativeStackNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name = "Login" component={Login} />
                <Stack.Screen name = "Registration" component={Registration}/>
                <Stack.Screen name = "Home" component={Home}/>
                <Stack.Screen name = "ForgotPassword" component={ForgotPassword}/>
                <Stack.Screen name = "ChangePassword" component={ChangePassword}/>
            </Stack.Navigator>
            <Text> Navigation </Text>
        </NavigationContainer>
    );
};

export default Navigation;