export interface Car {
    id: string;
    modelDescription: string;
    year: number;
    value: number;
    brandId: string;
    brandName: string;
}

export interface RegisterCar {
    modelDescription: string;
    year: number;
    value: number;
    brandId: string;
}

export interface UpdateCar {
    id: string;
    modelDescription: string;
    year: number;
    value: number;
    brandId: string;
}