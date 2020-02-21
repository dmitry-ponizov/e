export interface ICardConfig {
    content: {
        isCustom: boolean;
        isFacebook: boolean;
        isTwitter: boolean;
        isInstagramm: boolean;
    };
    integrations: {
        reservation: boolean;
        delivery: boolean;
        schedule: boolean;
    };
    isImageShow: boolean;
    isLogoShow: boolean;
}
export interface ICardContent {
    name: string;
    logo: string;
    rules: string;
    expires: string;
    offerCode: number;
}

export interface ICardInfoBar {
    points: number;
    level: number;
    program: string;
    reward: string;
    next: string;
}

export interface ICardMerchantData {
    title: string;
    name: string;
    address: string;
    phone: string;
    type: string;
    workTime: string;
}