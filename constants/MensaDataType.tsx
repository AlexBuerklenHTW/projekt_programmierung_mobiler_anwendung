type MensaDataType = {
    name: string;
    address: {
        street: string;
        city: string;
        zipcode: string;
        district: string;
        geoLocation: {
            longitude: number;
            latitude: number;
        };
    };
    id: string;
    businessDays: {
        day: string;
        businessHours: {
            openAt: string;
            closeAt: string;
            businessHourType: string;
        }[];
    }[];
    contactInfo?: {
        email: string;
        phone: string;
    };
    url?: string;
    clickAndCollect?: boolean;
    canteenReviewData?: any[];
    universities?: string[];
    lastUpdated?: string;
};