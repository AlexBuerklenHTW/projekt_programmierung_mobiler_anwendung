type MensaContextType = {
    mensaData: MensaDataType[] | null;
    menuData: MealType[] | null;
    loading: boolean;
    error: string | null;
    loadMenuForMensa: (canteenId: string) => MealType[] | null;
};