import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { createSwitchNavigator } from '@react-navigation/compat'
import Icon from 'react-native-vector-icons/FontAwesome'

import Feed from './screens/Feed'
import AddPhoto from './screens/AddPhoto'
import Profile from './screens/Profile'
import Login from './screens/Login'
import Register from './screens/Register'


const Stack = createStackNavigator()
const authRouter = () => 
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name='Register' component={Register} />
            <Stack.Screen name='Login' component={Login} />
        </Stack.Navigator>    

const loginOrProfileRouter= createSwitchNavigator({
    Profile: Profile,
    Auth: authRouter
}, {
    initialRouteName: 'Auth'
})

const Tab = createBottomTabNavigator()
export default props => (
    <Tab.Navigator 
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
            let iconName

            switch (route.name) {
                case 'Feed':
                    iconName = focused
                        ? 'home'
                        : 'home';
                    break
                case 'AddPhoto':
                    iconName = focused
                        ? 'camera'
                        : 'camera';
                    break
                case 'Profile':
                    iconName = focused ? 'user' : 'user';
                    break
            }

            return <Icon name={iconName} size={30} color={color} />;
        },
      })}
        tabBarOptions={{
            // activeTintColor: 'red',
            // inactiveTintColor: 'blue',
            showLabel: false
            // labelStyle: { fontSize: 30 }
    }} initialRouteName="Feed">
        <Tab.Screen name="Feed" component={Feed} />
        <Tab.Screen name="AddPhoto" component={AddPhoto} />
        <Tab.Screen name="Profile" component={loginOrProfileRouter} />
    </Tab.Navigator>
)