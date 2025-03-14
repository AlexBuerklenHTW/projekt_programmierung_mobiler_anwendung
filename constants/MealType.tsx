type MealType = {
    date: string;
    canteenId: string;
    meals: {
        name: string;
        category: string;
        prices: { priceType: string; price: number }[];
        additives: { referenceid: string; text: string }[];
        badges: { name: string; description: string }[];
        waterBilanz: number;
        co2Bilanz: number;
        id: string;
    }[];
};