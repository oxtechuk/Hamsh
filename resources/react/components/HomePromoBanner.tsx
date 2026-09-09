import React, { useMemo } from "react";
import { ArrowUpRight, ArrowLeft, ArrowRight, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { HomePromoBannerData } from "../types/home.types";

interface HomePromoBannerProps {
    banner?: HomePromoBannerData | null;
    className?: string;
}

function getYoutubeEmbedUrl(url?: string | null): string | null {
    if (!url || !url.trim()) return null;

    try {
        let videoId = "";
        if (url.includes("youtu.be/")) {
            videoId = url.split("youtu.be/")[1]?.split("?")[0]?.split("&")[0];
        } else if (url.includes("watch?v=")) {
            videoId = url.split("watch?v=")[1]?.split("&")[0];
        } else if (url.includes("embed/")) {
            videoId = url.split("embed/")[1]?.split("?")[0];
        }

        if (videoId) {
            return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;
        }
    } catch {
        return null;
    }

    return null;
}

export default function HomePromoBanner({
    banner,
    className = "",
}: HomePromoBannerProps) {
    const { i18n } = useTranslation();
    const isRTL = i18n.dir() === "rtl";

    const youtubeEmbedUrl = useMemo(
        () => getYoutubeEmbedUrl(banner?.youtube_url),
        [banner?.youtube_url],
    );

    if (!banner || !banner.enabled) {
        return null;
    }

    const {
        type = "image",
        image_desktop,
        image_mobile,
        video_url,
        title,
        subtitle,
        button_text,
        button_url,
        open_in_new_tab = false,
    } = banner;

    const hasImage = Boolean(image_desktop || image_mobile);
    const hasVideo = Boolean(video_url);
    const hasYoutube = Boolean(youtubeEmbedUrl);

    // If active but has no media at all, don't render an empty broken section
    if (type === "image" && !hasImage && !title && !button_text) return null;
    if (type === "video" && !hasVideo) return null;
    if (type === "youtube" && !hasYoutube) return null;

    const linkTarget = open_in_new_tab ? "_blank" : undefined;
    const linkRel = open_in_new_tab ? "noopener noreferrer" : undefined;
    const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

    return (
        <section
            dir={i18n.dir()}
            className={`w-full py-4 sm:py-6 lg:py-8 ${className}`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* 1. TYPE: IMAGE BANNER */}
                {type === "image" && (
                    <div className="group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl sm:rounded-3xl border border-gray-100 bg-gray-900">
                        {/* Background Image / Picture */}
                        {hasImage && (
                            <picture className="block w-full">
                                {image_mobile && (
                                    <source
                                        media="(max-width: 640px)"
                                        srcSet={image_mobile}
                                    />
                                )}
                                <img
                                    src={image_desktop || image_mobile || ""}
                                    alt={title || "Promo Banner"}
                                    className="h-auto min-h-[220px] w-full object-cover sm:min-h-[280px] md:min-h-[340px] lg:min-h-[380px] max-h-[500px] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                                    loading="lazy"
                                />
                            </picture>
                        )}

                        {/* Dark Gradient Overlay (always ensures text readability) */}
                        {(title || subtitle || button_text) && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent sm:bg-gradient-to-r sm:from-black/85 sm:via-black/50 sm:to-transparent flex flex-col justify-end sm:justify-center p-6 sm:p-10 lg:p-14 text-white">
                                <div className="max-w-xl space-y-3 sm:space-y-4">
                                    {title && (
                                        <h3 className="text-xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl text-white drop-shadow-md">
                                            {title}
                                        </h3>
                                    )}

                                    {subtitle && (
                                        <p className="text-sm sm:text-base lg:text-lg text-gray-200/95 leading-relaxed drop-shadow">
                                            {subtitle}
                                        </p>
                                    )}

                                    {button_text && button_url && (
                                        <div className="pt-2">
                                            {button_url.startsWith("http") ? (
                                                <a
                                                    href={button_url}
                                                    target={linkTarget}
                                                    rel={linkRel}
                                                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-primary-color,#2563EB)] px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-opacity-90 hover:scale-105 active:scale-95"
                                                >
                                                    <span>{button_text}</span>
                                                    <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                                                </a>
                                            ) : (
                                                <Link
                                                    to={button_url}
                                                    target={linkTarget}
                                                    rel={linkRel}
                                                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-primary-color,#2563EB)] px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-opacity-90 hover:scale-105 active:scale-95"
                                                >
                                                    <span>{button_text}</span>
                                                    <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* If no button or title, make whole banner clickable if button_url is set */}
                        {!button_text && button_url && (
                            button_url.startsWith("http") ? (
                                <a
                                    href={button_url}
                                    target={linkTarget}
                                    rel={linkRel}
                                    className="absolute inset-0 z-10"
                                    aria-label={title || "Banner Link"}
                                />
                            ) : (
                                <Link
                                    to={button_url}
                                    target={linkTarget}
                                    rel={linkRel}
                                    className="absolute inset-0 z-10"
                                    aria-label={title || "Banner Link"}
                                />
                            )
                        )}
                    </div>
                )}

                {/* 2. TYPE: UPLOADED VIDEO */}
                {type === "video" && hasVideo && (
                    <div className="relative overflow-hidden rounded-2xl shadow-xl sm:rounded-3xl border border-gray-100 bg-black">
                        <div className="relative w-full aspect-video max-h-[520px]">
                            <video
                                src={video_url || undefined}
                                controls
                                playsInline
                                loop
                                muted
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* Video Footer info if title or button exists */}
                        {(title || subtitle || (button_text && button_url)) && (
                            <div className="bg-gradient-to-r from-gray-900 via-gray-850 to-gray-900 p-5 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10">
                                <div className="space-y-1">
                                    {title && (
                                        <h4 className="text-lg sm:text-2xl font-bold">
                                            {title}
                                        </h4>
                                    )}
                                    {subtitle && (
                                        <p className="text-xs sm:text-sm text-gray-300">
                                            {subtitle}
                                        </p>
                                    )}
                                </div>

                                {button_text && button_url && (
                                    <div className="shrink-0">
                                        {button_url.startsWith("http") ? (
                                            <a
                                                href={button_url}
                                                target={linkTarget}
                                                rel={linkRel}
                                                className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-primary-color,#2563EB)] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95"
                                            >
                                                <span>{button_text}</span>
                                                <ArrowIcon className="h-4 w-4" />
                                            </a>
                                        ) : (
                                            <Link
                                                to={button_url}
                                                target={linkTarget}
                                                rel={linkRel}
                                                className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-primary-color,#2563EB)] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95"
                                            >
                                                <span>{button_text}</span>
                                                <ArrowIcon className="h-4 w-4" />
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* 3. TYPE: YOUTUBE EMBED VIDEO */}
                {type === "youtube" && hasYoutube && (
                    <div className="relative overflow-hidden rounded-2xl shadow-xl sm:rounded-3xl border border-gray-100 bg-gray-950">
                        <div className="relative w-full aspect-video max-h-[550px]">
                            <iframe
                                src={youtubeEmbedUrl || ""}
                                title={title || "YouTube Promo Video"}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="h-full w-full border-0"
                            />
                        </div>

                        {/* YouTube Footer Info */}
                        {(title || subtitle || (button_text && button_url)) && (
                            <div className="bg-gray-900 p-5 sm:p-7 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-800">
                                <div className="space-y-1">
                                    {title && (
                                        <h4 className="text-lg sm:text-2xl font-bold">
                                            {title}
                                        </h4>
                                    )}
                                    {subtitle && (
                                        <p className="text-xs sm:text-sm text-gray-300">
                                            {subtitle}
                                        </p>
                                    )}
                                </div>

                                {button_text && button_url && (
                                    <div className="shrink-0">
                                        {button_url.startsWith("http") ? (
                                            <a
                                                href={button_url}
                                                target={linkTarget}
                                                rel={linkRel}
                                                className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-primary-color,#2563EB)] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95"
                                            >
                                                <span>{button_text}</span>
                                                <ArrowIcon className="h-4 w-4" />
                                            </a>
                                        ) : (
                                            <Link
                                                to={button_url}
                                                target={linkTarget}
                                                rel={linkRel}
                                                className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-primary-color,#2563EB)] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95"
                                            >
                                                <span>{button_text}</span>
                                                <ArrowIcon className="h-4 w-4" />
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
