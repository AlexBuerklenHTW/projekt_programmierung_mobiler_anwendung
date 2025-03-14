import {View} from "react-native";
import {ActivityIndicator, Icon, Text} from 'react-native-paper';
import Settings from './Settings';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import {createStackNavigator, StackScreenProps} from '@react-navigation/stack';
import Mensa from '../../components/MensaComponent';
import { Appbar } from 'react-native-paper';
import MensaFavorites from "@/app/(tabs)/MensaFavorites";
import MealFavorites from "@/app/(tabs)/MealFavorites";
import {useMensa} from '@/context/MensaContext';
import {useTheme} from 'react-native-paper';
import MensaHeader from "@/components/InfoboxComponent";
import FoodDetailComponent from "@/components/FoodDetailComponent";
import Mensen from "@/app/(tabs)/index";
import React, { useEffect, useState } from "react";
import {MensaParamList} from "@/constants/MensaNavigationType";

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();
const MensaWrapper = (props: any) => <Mensa {...props} />;
type MensaScreenProps = StackScreenProps<MensaParamList, 'Mensa'>;


const MensenStack = () => {
    return (
    <Stack.Navigator>
      {/* Mensen Übersicht */}
      <Stack.Screen
        name="MensenOverview"
        component={Mensen}
        options={{
          title: 'Mensen Übersicht',
          header: () => (
            <Appbar.Header elevated={true}>
              <Appbar.Content title="Mensen Übersicht" />
            </Appbar.Header>
          ),
        }}
      />
      {/* Einzelne Mensa */}
        <Stack.Screen
            name="Mensa"
            component={MensaWrapper}
            options={(props) => {
            const { route } = props as MensaScreenProps;
            return {
                header: () => (
                    <MensaHeader mensaParam={route.params.mensa} />
                ),
            };
        }}
            />

        {/* Einzelnes Essen */}
        <Stack.Screen
            name="FoodDetail"
            component={FoodDetailComponent}
            options={({ route, navigation }) => {
                const { meal } = route.params as { meal: { name: string; [key: string]: any } };
                const mealName = meal.name;

                return {
                    header: () => (
                        <Appbar.Header elevated={true}>
                            <Appbar.Action
                                icon={({ color }) => <MaterialIcons name="arrow-back" size={24} color={color} />}
                                onPress={() => navigation.goBack()}
                                animated={false}
                            />
                            <Appbar.Content title={mealName} />
                        </Appbar.Header>
                    ),
                };
            }}
        />

    </Stack.Navigator>
  );
};

const SettingsStack = () => {
    return (
        <Stack.Navigator>
            {/* Settings Screen */}
            <Stack.Screen
                name="EinstellungenScreen"
                component={Settings}
                options={{
                    title: 'Einstellungen',
                    header: () => (
                        <Appbar.Header elevated={true}>
                            <Appbar.Content title="Einstellungen" />
                        </Appbar.Header>
                    ),
                }}
            />
            <Stack.Screen
                name="MensaFavorites"
                component={MensaFavorites}
                options={({ navigation }) => ({
                    title: 'Mensa Favoriten',
                    header: () => (
                        <Appbar.Header elevated={true}>
                            <Appbar.Action
                                icon={({ color }) => <MaterialIcons name="arrow-back" size={24} color={color} />}
                                onPress={() => navigation.goBack()}
                                animated={false}
                            />
                            <Appbar.Content title="Mensa Favoriten" />
                        </Appbar.Header>
                    )
                })}
            />
            <Stack.Screen
                name="MealFavorites"
                component={MealFavorites}
                options={({ navigation }) => ({
                    title: 'Speisen Favoriten',
                    header: () => (
                        <Appbar.Header elevated={true}>
                            <Appbar.Action
                                icon={({ color }) => <MaterialIcons name="arrow-back" size={24} color={color} />}
                                onPress={() => navigation.goBack()}
                                animated={false}
                            />
                            <Appbar.Content title="Speisen Favoriten" />
                        </Appbar.Header>
                    )
                })}
            />
            <Stack.Screen
                name="Mensa"
                component={MensaWrapper}
                options={(props) => {
                    const { route } = props as MensaScreenProps;
                    return {
                        header: () => (
                            <MensaHeader mensaParam={route.params.mensa} />
                        ),
                    };
                }}
            />
            <Stack.Screen
                name="FoodDetail"
                component={FoodDetailComponent}
                options={({ route, navigation }) => {
                    const { meal } = route.params as { meal: { name: string; [key: string]: any } };
                    const mealName = meal.name;

                    return {
                        header: () => (
                            <Appbar.Header elevated={true}>
                                <Appbar.Action
                                    icon={({ color }) => <MaterialIcons name="arrow-back" size={24} color={color} />}
                                    onPress={() => navigation.goBack()}
                                    animated={false}
                                />
                                <Appbar.Content title={mealName} />
                            </Appbar.Header>
                        ),
                    };
                }}
            />

        </Stack.Navigator>
    );
};

export default function TabLayout() {
  const {colors} = useTheme();

  const {loading, error} = useMensa();
  const [dots, setDots] = useState('');
  useEffect(() => {
    const interval = setInterval(() => {
        setDots(prevDots => (prevDots.length < 3 ? prevDots + '.' : ''));
    }, 500);
    return () => clearInterval(interval);
  }, []);
  if (loading) {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.background
            }}
        >
            <ActivityIndicator animating={true} size='large'/>
            <Text style={{marginTop:15}}>Laden {dots}</Text> 
        </View>
    );
  }
  if (error) {
      return (
          <View
              style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.background
              }}>
              <Icon
                  source="alert-circle"
                  size={20}
              />
              <Text>{error}</Text>
              <Text>Überprüfe die Verbindung.</Text>
          </View>
      );
  }

  return (
      <Tab.Navigator>
          <Tab.Screen
              name="Mensen"
              component={MensenStack}
              options={{
                  tabBarIcon: ({ color }: { color: string }) => (
                      <MaterialIcons name="home" color={color} size={26} />
                  ),
              }}
          />
          <Tab.Screen
              name="Einstellungen"
              component={SettingsStack}
              options={{
                  tabBarIcon: ({ color }: { color: string }) => (
                      <MaterialIcons name="settings" color={color} size={26} />
                  ),
              }}
          />
      </Tab.Navigator>
  );
}
