import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/shared/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/components/ui/input";

interface FooterProps {
  columns?: FooterColumn[];
  contactInfo?: ContactInfo;
  socialLinks?: SocialLink[];
  copyrightText?: string;
}

interface FooterColumn {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

interface SocialLink {
  platform: "facebook" | "twitter" | "instagram" | "youtube";
  href: string;
}

const Footer = ({
  columns = [
    {
      title: "Shop",
      links: [
        { label: "All Products", href: "/products" },
        { label: "Featured", href: "/products/featured" },
        { label: "New Arrivals", href: "/products/new" },
        { label: "Sale Items", href: "/products/sale" },
      ],
    },
    {
      title: "Categories",
      links: [
        { label: "Electronics", href: "/category/electronics" },
        { label: "Clothing", href: "/category/clothing" },
        { label: "Home & Garden", href: "/category/home-garden" },
        { label: "Beauty", href: "/category/beauty" },
      ],
    },
    {
      title: "Customer Service",
      links: [
        { label: "Contact Us", href: "/contact" },
        { label: "FAQs", href: "/faqs" },
        { label: "Shipping Policy", href: "/shipping" },
        { label: "Returns & Refunds", href: "/returns" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: "Privacy Policy", href: "/privacy" },
      ],
    },
  ],
  contactInfo = {
    email: "support@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Commerce St, Shopping City, SC 12345",
  },
  socialLinks = [
    { platform: "facebook", href: "https://facebook.com" },
    { platform: "twitter", href: "https://twitter.com" },
    { platform: "instagram", href: "https://instagram.com" },
    { platform: "youtube", href: "https://youtube.com" },
  ],
  copyrightText = "© 2023 E-Commerce Store. All rights reserved.",
}: FooterProps) => {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <Facebook className="h-5 w-5" />;
      case "twitter":
        return <Twitter className="h-5 w-5" />;
      case "instagram":
        return <Instagram className="h-5 w-5" />;
      case "youtube":
        return <Youtube className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <footer className="bg-gray-100 w-full">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Newsletter Signup */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-600 mb-4">
              Subscribe to our newsletter for the latest products, offers, and
              updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-grow"
              />
              <Button type="submit" className="whitespace-nowrap">
                Subscribe
              </Button>
            </div>

            {/* Contact Information */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {contactInfo.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-gray-600" />
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-gray-600 mt-1" />
                  <span className="text-gray-600">{contactInfo.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Navigation Columns */}
          {columns.map((column, index) => (
            <div key={index}>
              <h3 className="text-xl font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-gray-900 flex items-center gap-1 group"
                    >
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition-colors"
                  aria-label={`Follow us on ${link.platform}`}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
            <div className="text-gray-600 text-center md:text-right">
              {copyrightText}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
