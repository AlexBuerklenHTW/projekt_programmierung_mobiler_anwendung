import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useTheme, Card, Title, ActivityIndicator } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { useMensa } from '@/context/MensaContext';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {MensaParamList} from "@/constants/MensaNavigationType";

export default function MensaFavorites() {
    const { colors } = useTheme();
    const [favorites, setFavorites] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const { mensaData } = useMensa();
    const navigation = useNavigation<NativeStackNavigationProp<MensaParamList, 'Mensen'>>();


    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const storedFavorites = await AsyncStorage.getItem('MensaFavorites');
                if (storedFavorites) {
                    setFavorites(JSON.parse(storedFavorites));
                }
            } catch (error) {
                console.error("Fehler beim Laden der Favoriten:", error);
            } finally {
                setLoading(false);
            }
        };

        loadFavorites();
    }, []);

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.background,
                }}
            >
                <ActivityIndicator animating={true} size="large" />
            </View>
        );
    }

    const favoriteMensas = (mensaData || []).filter((mensa) =>
        favorites[mensa.name]
    );

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.background,
            }}
        >
            <ScrollView
                style={{
                    flex: 1,
                }}
                contentContainerStyle={{
                    paddingVertical: 40,
                    paddingHorizontal: 20,
                }}
            >
                {favoriteMensas.length > 0 ? (
                favoriteMensas.map((mensa) => (
                    <Card
                        key={mensa.id}
                        style={{margin: 10}}
                        onPress={() => navigation.navigate('Mensa', { mensa })}
                    >
                        <Card.Title 
                            title={mensa.name}
                            subtitle={mensa.address.street}
                            right={(props: any) => (
                                <MaterialIcons
                                    {...props}
                                    name="arrow-forward"
                                    size={24}
                                    style={{margin: 10}}
                                    color={colors.onBackground}
                                />
                            )}
                        />
                    </Card>
                ))
            ) : (
                <Card style={{margin: 10}}>
                    <Card.Content>
                        <Title>Keine Favoriten gespeichert.</Title>
                    </Card.Content>
                </Card>
            )}
            </ScrollView>
        </View>
    );
}
