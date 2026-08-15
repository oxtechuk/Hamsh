export type ISpecialOrderStep = 1 | 2 | 3;

export interface ISpecialOrderPersonalInfo {
    fullName: string;
    phone: string;
    email: string;
    city: string;

    salary: string;
    obligations: string;
}

export interface ISpecialOrderCarDetails {
    brand: string;
    model: string;
    year: string;
    color: string;
    transmission: string;
    fuelType: string;
    notes: string;
}

export interface ISpecialOrderBudget {
    salaryRange: string;
    notes: string;
}

export interface IOrderStepperStep {
    number: number;
    label: string;
}

export interface ISpecialOrderStepperProps {
    activeStep: ISpecialOrderStep;
    steps?: IOrderStepperStep[];
}

export interface ISpecialOrderStepCircleProps {
    number: number;
    label: string;
    active: boolean;
    done: boolean;
}
