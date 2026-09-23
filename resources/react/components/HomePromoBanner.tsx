import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Volume2, VolumeX, Play, Pause } from "lucide-react";
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
            return `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&mute=1&playsinline=1&rel=0&modestbranding=1`;
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

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);

    const youtubeEmbedUrl = useMemo(
        () => getYoutubeEmbedUrl(banner?.youtube_url),
        [banner?.youtube_url],
    );

    // Scroll-into-view Intersection Observer for auto-playing upon scrolling
    useEffect(() => {
        if (!banner || !banner.enabled) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const isVisible = entry.isIntersecting;

                    // 1. Handle Uploaded Video playback
                    if (videoRef.current) {
                        if (isVisible) {
                            videoRef.current.muted = true;
                            videoRef.current
                                .play()
                                .then(() => {
                                    setIsPlaying(true);
                                })
                                .catch(() => {
                                    // Browser prevented playback
                                });
                        } else {
                            videoRef.current.pause();
                            setIsPlaying(false);
                        }
                    }

                    // 2. Handle YouTube iframe playback via postMessage
                    if (iframeRef.current && iframeRef.current.contentWindow) {
                        try {
                            const command = isVisible
                                ? '{"event":"command","func":"playVideo","args":""}'
                                : '{"event":"command","func":"pauseVideo","args":""}';
                            iframeRef.current.contentWindow.postMessage(
                                command,
                                "*",
                            );
                        } catch {
                            // Cross-origin fallback
                        }
                    }
                });
            },
            {
                threshold: 0.35, // Plays when at least 35% visible
            },
        );

        const target = containerRef.current;
        if (target) {
            observer.observe(target);
        }

        return () => {
            if (target) {
                observer.unobserve(target);
            }
            observer.disconnect();
        };
    }, [banner]);

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

    if (type === "image" && !hasImage && !title && !button_text) return null;
    if (type === "video" && !hasVideo) return null;
    if (type === "youtube" && !hasYoutube) return null;

    const linkTarget = open_in_new_tab ? "_blank" : undefined;
    const linkRel = open_in_new_tab ? "noopener noreferrer" : undefined;
    const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

    const toggleVideoPlay = () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play().then(() => setIsPlaying(true));
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const toggleVideoMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!videoRef.current) return;
        const nextState = !videoRef.current.muted;
        videoRef.current.muted = nextState;
        setIsMuted(nextState);
    };

    return (
        <section
            ref={containerRef}
            dir={i18n.dir()}
            className={`w-full py-4 sm:py-6 lg:py-8 ${className}`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* 1. TYPE: IMAGE BANNER */}
                {type === "image" && (
                    <div className="group relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl sm:rounded-3xl border border-gray-100 bg-gray-900">
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

                {/* 2. TYPE: UPLOADED VIDEO (Auto-plays on scroll) */}
                {type === "video" && hasVideo && (
                    <div className="group relative overflow-hidden rounded-2xl shadow-xl sm:rounded-3xl border border-gray-100 bg-black">
                        <div
                            className="relative w-full aspect-video max-h-[520px] cursor-pointer"
                            onClick={toggleVideoPlay}
                        >
                            <video
                                ref={videoRef}
                                src={video_url || undefined}
                                playsInline
                                loop
                                muted={isMuted}
                                preload="metadata"
                                className="h-full w-full object-cover"
                            />

                            {/* Controls & Sound overlay */}
                            <div className="absolute top-4 end-4 z-20 flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={toggleVideoMute}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all duration-200 hover:bg-black/90 hover:scale-110 active:scale-95"
                                    title={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
                                    aria-label="Sound Toggle"
                                >
                                    {isMuted ? (
                                        <VolumeX className="h-5 w-5" />
                                    ) : (
                                        <Volume2 className="h-5 w-5" />
                                    )}
                                </button>
                            </div>

                            {/* Pause/Play Center Indicator on Hover */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-black/20 pointer-events-none">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md">
                                    {isPlaying ? (
                                        <Pause className="h-6 w-6" />
                                    ) : (
                                        <Play className="h-6 w-6 ms-0.5" />
                                    )}
                                </div>
                            </div>
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

                {/* 3. TYPE: YOUTUBE EMBED VIDEO (Auto-plays on scroll) */}
                {type === "youtube" && hasYoutube && (
                    <div className="relative overflow-hidden rounded-2xl shadow-xl sm:rounded-3xl border border-gray-100 bg-gray-950">
                        <div className="relative w-full aspect-video max-h-[550px]">
                            <iframe
                                ref={iframeRef}
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
