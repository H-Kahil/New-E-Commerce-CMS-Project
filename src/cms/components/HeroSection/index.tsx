import React, { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  language: "en" | "ar";
}

interface HeroSectionProps {
  slides?: HeroSlide[];
  autoplaySpeed?: number;
  showIndicators?: boolean;
  showArrows?: boolean;
}

const HeroSection = ({
  slides = [
    {
      id: "1",
      title: "Summer Collection 2023",
      subtitle: "Discover the latest trends for the season",
      imageUrl:
        "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1400&q=80",
      ctaText: "Shop Now",
      ctaLink: "/collections/summer",
      language: "en",
    },
    {
      id: "2",
      title: "New Arrivals",
      subtitle: "Be the first to explore our newest products",
      imageUrl:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80",
      ctaText: "Explore",
      ctaLink: "/new-arrivals",
      language: "en",
    },
    {
      id: "3",
      title: "Special Offers",
      subtitle: "Limited time discounts on selected items",
      imageUrl:
        "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1400&q=80",
      ctaText: "View Offers",
      ctaLink: "/offers",
      language: "en",
    },
  ],
  autoplaySpeed = 5000,
  showIndicators = true,
  showArrows = true,
}: HeroSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, autoplaySpeed);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, slides.length, autoplaySpeed]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    // Pause autoplay briefly when manually changing slides
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden bg-gray-100">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute top-0 left-0 w-full h-full transition-opacity duration-1000",
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.imageUrl})` }}
            >
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Content */}
            <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 md:px-8 lg:px-16 text-white">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-2xl">
                {slide.subtitle}
              </p>
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 hover:text-black"
                asChild
              >
                <a href={slide.ctaLink}>{slide.ctaText}</a>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <button
            onClick={goToPrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 rounded-full p-2 backdrop-blur-sm transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={goToNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 rounded-full p-2 backdrop-blur-sm transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-colors",
                index === currentSlide
                  ? "bg-white"
                  : "bg-white/40 hover:bg-white/60",
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSection;
