import React from "react";
import { Button } from "@/shared/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface PromotionalBannerProps {
  title?: string;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonText?: string;
  buttonLink?: string;
  imageUrl?: string;
  alignment?: "left" | "center" | "right";
  showButton?: boolean;
}

const PromotionalBanner = ({
  title = "Special Offer: 20% Off All Summer Collection",
  description = "Limited time offer. Shop now and refresh your wardrobe with our latest summer styles.",
  backgroundColor = "bg-gradient-to-r from-purple-600 to-indigo-700",
  textColor = "text-white",
  buttonText = "Shop Now",
  buttonLink = "/collections/summer",
  imageUrl = "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&q=80",
  alignment = "left",
  showButton = true,
}: PromotionalBannerProps) => {
  // Determine text alignment class based on alignment prop
  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <div
      className={`w-full ${backgroundColor} ${textColor} py-8 px-6 md:px-10 lg:px-16 bg-white`}
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10">
        {/* Image section (conditionally rendered) */}
        {imageUrl && (
          <div className="w-full md:w-1/3 flex justify-center">
            <img
              src={imageUrl}
              alt="Promotional banner"
              className="rounded-lg object-cover h-48 w-full md:h-auto shadow-lg"
            />
          </div>
        )}

        {/* Content section */}
        <div
          className={`w-full ${imageUrl ? "md:w-2/3" : "md:w-full"} flex flex-col ${alignmentClasses[alignment]} gap-4`}
        >
          {title && <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>}
          {description && (
            <p className="text-sm md:text-base opacity-90 max-w-2xl">
              {description}
            </p>
          )}

          {showButton && (
            <Link to={buttonLink}>
              <Button className="mt-2 group" size="lg">
                {buttonText}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromotionalBanner;
