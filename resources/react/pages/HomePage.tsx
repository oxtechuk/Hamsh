import { useTranslation } from "react-i18next";

import { APP_IMAGES, getImageUrl } from "../constants/app-images";
import HomeHero from "../components/HomeHero";
import FeaturedCarsSection from "../components/FeaturedCarsSection";
import BudgetCarsSection from "../components/BudgetCarsSection";
import PurchaseExperienceSection from "../components/PurchaseExperienceSection";
import BrandsSection from "../components/BrandsSection";
import CarsSearchSection from "../components/CarsSearchSection";
import HomeOffersSection from "../components/HomeOffersSection";
import HomePageSkeleton from "../components/HomePageSkeleton";

import { useHomePageData } from "../hooks/useHomePageData";
import { useSEO } from "../utils/useSEO";

export default function Home() {
    const { t } = useTranslation();
    useSEO(t("nav.home"), t("hero.description"));

    const {
        data,
        isLoading,
        latestCars,
        homeOffers,
        brands,
        brandCategories,
        priceRanges,
        budgetCars,
        brandTypeId,
        setBrandTypeId,
        setBrandSearch,
        activeBudgetRange,
        setActiveBudgetRange,
        handleSearch,
    } = useHomePageData();

    if (isLoading) {
        return <HomePageSkeleton />;
    }

    return (
        <div className="flex flex-col gap-8 overflow-x-hidden sm:gap-10 lg:gap-12">
            <HomeHero
                slides={
                    data?.hero_slides?.length
                        ? data.hero_slides.map((slide, index) => ({
                              id: index,
                              image:
                                  getImageUrl(slide.image) ||
                                  APP_IMAGES.CAR_PLACEHOLDER,
                              detailsTo: slide.link || undefined,
                              buttonText: slide.button_text || undefined,
                          }))
                        : [
                              {
                                  id: 0,
                                  image: APP_IMAGES.HOME_HERO,
                              },
                          ]
                }
            />

            <CarsSearchSection
                brands={data?.filter_brands ?? data?.brands}
                types={data?.filter_types}
                categories={data?.filter_categories}
                years={data?.filter_years}
                onSearch={handleSearch}
            />

            <BrandsSection
                titleBlue={t("brandsSection.titleBlue")}
                buttonText={t("brandsSection.buttonText")}
                buttonTo="/brands"
                brands={brands}
                categories={brandCategories}
                activeCategory={brandTypeId}
                onCategoryChange={setBrandTypeId}
                onSearchChange={setBrandSearch}
            />

            <FeaturedCarsSection
                titleBlue={
                    // data?.page_sections?.featured_cars?.title?.trim() ||
                    t("featuredCars.titleBlue")
                }
                buttonText={
                    // data?.page_sections?.featured_cars?.button_text?.trim() ||
                    t("featuredCars.buttonText")
                }
                buttonTo="/cars"
                cars={latestCars}
            />

            {homeOffers.length > 0 && (
                <HomeOffersSection
                    slides={homeOffers}
                    autoPlay
                    interval={5000}
                />
            )}

            <BudgetCarsSection
                titleBlue={
                    data?.page_sections?.budget?.title?.trim() ||
                    t("budgetCars.titleBlue")
                }
                description={
                    data?.page_sections?.budget?.description?.trim() ||
                    t("budgetCars.description")
                }
                buttonText={
                    data?.page_sections?.budget?.button_text?.trim() ||
                    t("budgetCars.buttonText")
                }
                buttonTo="/cars"
                cars={budgetCars}
                ranges={priceRanges}
                activeRange={activeBudgetRange}
                onRangeChange={setActiveBudgetRange}
            />

            <PurchaseExperienceSection
                features={
                    data?.hero?.features?.length
                        ? data.hero.features.map((f, i) => ({
                              id: f.icon || String(i),
                              title: f.title,
                              description: f.description,
                              icon: f.icon,
                          }))
                        : undefined
                }
            />
        </div>
    );
}
