import React, { useContext, useEffect} from "react";
import {View, StyleSheet, Switch, ScrollView} from "react-native";
import {useTheme, Card, Title, RadioButton} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from "@react-navigation/native";
import { RoleContext } from '@/context/RoleContext';
import { useThemeContext } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SettingsParamList} from "@/constants/SettingsScreenNavigationProp";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

type SettingsScreenNavigationProp = NativeStackNavigationProp<SettingsParamList, 'Settings'>;

export default function Settings() {
    const { isDarkMode, toggleDarkMode } = useThemeContext();
    const { colors } = useTheme();
    const navigation = useNavigation<SettingsScreenNavigationProp>();

    const { role, setRole } = useContext(RoleContext);

    useEffect(() => {
        const loadRoleFromStorage = async () => {
            try {
                const storedRole = await AsyncStorage.getItem('Role');
                if (storedRole) {
                    setRole(storedRole);
                }
            } catch (error) {
                console.error('Fehler beim Laden der Rolle aus AsyncStorage:', error);
            }
        };

        loadRoleFromStorage();
    }, [setRole]);

    useEffect(() => {
        if (role) {
            AsyncStorage.setItem('Role', role);
        }
    }, [role]);

    return (
        <View style={{flex: 1, backgroundColor: colors.background}}>
            <ScrollView
                style={{
                    flex: 1,
                }}
                contentContainerStyle={{
                    justifyContent: "flex-start",
                    alignItems: "center"
                }}
            >
                <Card style={[styles.card, {marginTop: 20}]}>
                    <Card.Content style={{flexDirection: 'row', alignItems: 'center'}}>
                        <MaterialIcons name="wb-sunny" size={24} color={colors.onBackground}/>
                        <Title style={{flex: 1, marginLeft: 10}}>Dark Mode</Title>
                        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
                    </Card.Content>
                </Card>
                <Card style={[styles.card, {marginTop: 20}]}
                      onPress={() => navigation.navigate('MensaFavorites')}>
                    <Card.Content style={{flexDirection: 'row', alignItems: 'center'}}>
                        <MaterialIcons name="star-border" size={24} color={colors.onBackground}/>
                        <Title style={{flex: 1, marginLeft: 10}}>Mensa Favoriten</Title>
                        <MaterialIcons name="arrow-forward" size={24} color={colors.onBackground}/>
                    </Card.Content>
                </Card>

                <Card style={[styles.card, {marginTop: 20}]}
                      onPress={() => navigation.navigate('MealFavorites')}>
                    <Card.Content style={{flexDirection: 'row', alignItems: 'center'}}>
                        <MaterialIcons name="star-border" size={24} color={colors.onBackground}/>
                        <Title style={{flex: 1, marginLeft: 10}}>Speisen Favoriten</Title>
                        <MaterialIcons name="arrow-forward" size={24} color={colors.onBackground}/>
                    </Card.Content>
                </Card>

                <Card style={[styles.card, {marginTop: 20, marginBottom: 20}]}>
                    <Card.Content>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <MaterialIcons name="manage-accounts" size={24} color={colors.onBackground}/>
                            <Title style={{flex: 1, marginLeft: 10}}>Rolle</Title>
                        </View>
                        <RadioButton.Group onValueChange={(newValue) => setRole(newValue)} value={role}>
                            <RadioButton.Item label="Studierende" value="Studierende" mode='android' />
                            <RadioButton.Item label="Angestellte" value="Angestellte" mode='android' />
                            <RadioButton.Item label="Gäste" value="Gäste" mode='android' />
                        </RadioButton.Group>
                    </Card.Content>
                </Card>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "90%"
    },
});
