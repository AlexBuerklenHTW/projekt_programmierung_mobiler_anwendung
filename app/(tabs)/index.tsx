import {View, ScrollView} from "react-native";
import {Card, IconButton, Text, Snackbar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from 'react-native-paper';
import {useEffect, useState} from "react";
import {useMensa} from '@/context/MensaContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {MensaParamList} from "@/constants/MensaNavigationType";

export default function Mensen() {
    const [selectedStars, setSelectedStars] = useState<{ [key: string]: boolean }>({});
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    useEffect(() => {
        const getFavoritesFromAsyncStorage = async () => {
            try {
                const mensaFavorites = await AsyncStorage.getItem('MensaFavorites');
                if (mensaFavorites) {
                    setSelectedStars(JSON.parse(mensaFavorites));
                }
            } catch (error) {
                console.error('Fehler beim Abrufen der Daten aus AsyncStorage:', error);
            }
        };

        getFavoritesFromAsyncStorage();
    }, []);

    const toggleStar = async (key: string, name: string) => {
        const newSelectedStars = {...selectedStars};

        if (selectedStars[key]) {
            delete newSelectedStars[key];
            setSnackbarMessage(`${name} als Favorit entfernt`);
        } else {
            newSelectedStars[key] = true;
            setSnackbarMessage(`${name} als Favorit hinzugefügt`);
        }

        setSelectedStars(newSelectedStars);
        setSnackbarVisible(true);

        if (Object.keys(newSelectedStars).length === 0) {
            await AsyncStorage.removeItem('MensaFavorites');
        } else {
            await AsyncStorage.setItem('MensaFavorites', JSON.stringify(newSelectedStars));
        }
    };

    const {mensaData} = useMensa();
    const navigation = useNavigation<NativeStackNavigationProp<MensaParamList, 'Mensen'>>();
    const {colors} = useTheme();

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
                {mensaData?.map((mensa) => (
                    <Card key={mensa.id} style={{ margin: 10 }}
                          onPress={() => navigation.navigate('Mensa', { mensa })}
                    >
                        <Card.Content>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', flexWrap: 'wrap' }}>
                                {mensa.name}
                            </Text>
                            <Text style={{ fontSize: 14, flexWrap: 'wrap', marginTop: 5 }}>
                                {mensa.address.street}
                            </Text>
                        </Card.Content>
                        <Card.Actions>
                            <IconButton
                                icon={selectedStars[mensa.name] ? 'star' : 'star-outline'}
                                onPress={() => toggleStar(mensa.name, mensa.name)}
                            />
                        </Card.Actions>
                    </Card>
                ))}
            </ScrollView>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={2000}
            >
                {snackbarMessage}
            </Snackbar>
        </View>
    );
}
