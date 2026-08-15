export interface IBlogsPageHeroProps {
    badgeText?: string;
    title: string;
    description?: string;
    image?: string;

    categories?: {
        label: string;
        value: string;
    }[];

    activeCategory?: string;

    onCategoryChange?: (value: string) => void;
}
