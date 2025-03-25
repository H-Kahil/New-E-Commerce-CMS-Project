import React, { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
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
      title: "Luxury Fashion Collection",
      subtitle: "Elevate your style with our premium designer pieces",
      imageUrl:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=90",
      ctaText: "Shop Collection",
      ctaLink: "/collections/luxury",
      language: "en",
    },
    {
      id: "2",
      title: "Summer Essentials",
      subtitle: "Discover the perfect pieces for warm weather style",
      imageUrl:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=90",
      ctaText: "Explore Now",
      ctaLink: "/collections/summer",
      language: "en",
    },
    {
      id: "3",
      title: "Exclusive Limited Edition",
      subtitle: "Handcrafted pieces that define modern elegance",
      imageUrl:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1400&q=90",
      ctaText: "Shop Limited Edition",
      ctaLink: "/collections/limited",
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
    <div className="relative w-full h-[700px] overflow-hidden bg-gray-100 shadow-xl rounded-lg">
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
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
              style={{
                backgroundImage: `url(${slide.imageUrl})`,
                backgroundPosition: "center 30%",
              }}
            >
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-20 flex flex-col items-start justify-center h-full text-left px-8 md:px-16 lg:px-24 text-white max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl mb-10 max-w-2xl font-light">
                {slide.subtitle}
              </p>
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 hover:text-black text-lg px-8 py-6 h-auto"
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
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 rounded-full p-3 backdrop-blur-sm transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-8 w-8 text-white" />
          </button>
          <button
            onClick={goToNextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 rounded-full p-3 backdrop-blur-sm transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-8 w-8 text-white" />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-4 h-4 rounded-full transition-colors",
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
