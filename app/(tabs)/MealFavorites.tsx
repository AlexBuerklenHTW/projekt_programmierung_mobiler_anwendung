import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useTheme, Card, Title, ActivityIndicator } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useMensa } from "@/context/MensaContext";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {MealParamList} from "@/constants/MealNavigationType";

export default function MealFavorites() {
    type MealScreenNavigationProp = NativeStackNavigationProp<MealParamList, 'FoodDetail'>;
    const navigation = useNavigation<MealScreenNavigationProp>();
    const { colors } = useTheme();
    const [favorites, setFavorites] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const { menuData } = useMensa();

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const storedFavorites = await AsyncStorage.getItem("MealFavorites");
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
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.background,
                }}
            >
                <ActivityIndicator animating={true} size="large" />
            </View>
        );
    }

    const favoriteMeals = Array.from(
        new Map(
            (menuData || [])
                .flatMap((menu) => menu.meals)
                .filter((meal) => favorites[meal.id])
                .map((meal) => [meal.id, meal])
        ).values()
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
                {favoriteMeals.length > 0 ? (
                    favoriteMeals.map((meal) => (
                        <Card
                            key={meal.id}
                            style={{ margin: 10 }}
                            onPress={() => navigation.navigate('FoodDetail', { meal })}
                        >
                            <Card.Title
                                title={meal.name}
                                subtitle={meal.category}
                                right={(props: any) => (
                                    <MaterialIcons
                                        {...props}
                                        name="arrow-forward"
                                        size={24}
                                        style={{ margin: 10 }}
                                        color={colors.onBackground}
                                    />
                                )}
                            />
                        </Card>
                    ))
                ) : (
                    <Card style={{ margin: 10 }}>
                        <Card.Content>
                            <Title>Keine Favoriten gespeichert.</Title>
                        </Card.Content>
                    </Card>
                )}
            </ScrollView>
        </View>
    );
}
