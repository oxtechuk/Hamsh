export interface IPurchaseFeature {
    id: string;
    title: string;
    description: string;
    icon: string;
}

export interface IPurchaseExperienceSectionProps {
    title?: string;
    description?: string;
    features?: IPurchaseFeature[];
}
