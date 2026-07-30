import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useLanguageStore } from "../store/language.store";
import { APP_IMAGES } from "../constants/app-images";
import { useSEO } from "../utils/useSEO";
import { getAboutPageData } from "../services/api";
import type { IAboutData } from "../interfaces/IAboutData";
import PageIntroHero from "../components/PageIntroHero";
import AboutStorySection from "../components/AboutStorySection";
import AboutTestimonialsSection from "../components/AboutTestimonialsSection";
import AboutStatsSection from "../components/AboutStatsSection";

export default function AboutPage() {
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);

  useSEO(t("nav.about"), t("aboutPage.hero.description"));

  const { data: aboutData } = useQuery<IAboutData>({
    queryKey: ["about", language],
    queryFn: getAboutPageData,
  });

  const aboutStats =
    aboutData?.about_stats?.map((stat, index) => ({
      id: index + 1,
      value: stat.value,
      label: stat.label,
    })) ?? [];

  return (
    <>
      <PageIntroHero
        eyebrow={aboutData?.page_sections.hero.badge || t("aboutPage.hero.badge")}
        title={aboutData?.page_sections.hero.title || t("aboutPage.hero.title")}
        description={
          aboutData?.page_sections.hero.subtitle || t("aboutPage.hero.subtitle")
        }
        minHeight={160}
      />

      <AboutStorySection
        eyebrow={
          aboutData?.page_sections.story.badge || t("aboutPage.story.eyebrow")
        }
        title={
          aboutData?.page_sections.story.title || t("aboutPage.story.title")
        }
        paragraphs={
          aboutData?.page_sections.story.content
            ? [aboutData.page_sections.story.content]
            : [
                t("aboutPage.story.paragraphs.0"),
                t("aboutPage.story.paragraphs.1"),
              ]
        }
        primaryImage={
          aboutData?.page_sections.hero.gallery_images?.[0] ||
          APP_IMAGES.GALLERY_G1
        }
        secondaryImage={
          aboutData?.page_sections.hero.gallery_images?.[1] ||
          APP_IMAGES.GALLERY_G2
        }
        statValue="#1"
        statLabel={t("aboutPage.story.statLabel")}
        values={
          aboutData?.page_sections.story
            ? [
                {
                  id: "vision",
                  title:
                    aboutData.page_sections.story.vision_title ||
                    t("aboutPage.story.values.vision.title"),
                  description:
                    aboutData.page_sections.story.vision_text ||
                    t("aboutPage.story.values.vision.description"),
                },
                {
                  id: "mission",
                  title:
                    aboutData.page_sections.story.mission_title ||
                    t("aboutPage.story.values.mission.title"),
                  description:
                    aboutData.page_sections.story.mission_text ||
                    t("aboutPage.story.values.mission.description"),
                },
                {
                  id: "values",
                  title:
                    aboutData.page_sections.story.message_title ||
                    t("aboutPage.story.values.values.title"),
                  description:
                    aboutData.page_sections.story.message_text ||
                    t("aboutPage.story.values.values.description"),
                },
              ]
            : undefined
        }
      />

      <AboutTestimonialsSection
        eyebrow={
          aboutData?.page_sections.testimonials.badge ||
          t("aboutPage.testimonials.badge")
        }
        title={
          aboutData?.page_sections.testimonials.title ||
          t("aboutPage.testimonials.title")
        }
        testimonials={
          aboutData?.testimonials?.map((item) => ({
            id: item.id,
            quote: item.content,
            customerName: item.name,
            customerCar: item.title,
            rating: item.rating,
          })) ?? []
        }
      />

      <AboutStatsSection stats={aboutStats} />
    </>
  );
}
