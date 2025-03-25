// Configuration for CMS layout settings

export interface CMSLayoutConfig {
  header: {
    logo: string;
    showSearch: boolean;
    showLanguageSwitcher: boolean;
    showCart: boolean;
  };
  footer: {
    showNewsletter: boolean;
    showContactInfo: boolean;
    showSocialLinks: boolean;
    copyrightText: string;
  };
  homePage: {
    sections: {
      id: string;
      type: string;
      enabled: boolean;
      order: number;
      settings?: Record<string, any>;
    }[];
  };
}

const cmsLayoutConfig: CMSLayoutConfig = {
  header: {
    logo: "E-Store",
    showSearch: true,
    showLanguageSwitcher: true,
    showCart: true,
  },
  footer: {
    showNewsletter: true,
    showContactInfo: true,
    showSocialLinks: true,
    copyrightText: "© 2023 E-Commerce Store. All rights reserved.",
  },
  homePage: {
    sections: [
      {
        id: "hero",
        type: "hero-section",
        enabled: true,
        order: 1,
      },
      {
        id: "featured-categories",
        type: "featured-categories",
        enabled: true,
        order: 2,
      },
      {
        id: "featured-products",
        type: "product-grid",
        enabled: true,
        order: 3,
        settings: {
          title: "Featured Products",
          subtitle: "Discover our most popular items",
          columns: 3,
          maxItems: 6,
        },
      },
      {
        id: "promotional-banner",
        type: "promotional-banner",
        enabled: true,
        order: 4,
      },
      {
        id: "new-arrivals",
        type: "product-grid",
        enabled: true,
        order: 5,
        settings: {
          title: "New Arrivals",
          subtitle: "Check out our latest products",
          columns: 4,
          maxItems: 8,
        },
      },
      {
        id: "newsletter",
        type: "newsletter-signup",
        enabled: true,
        order: 6,
      },
    ],
  },
};

export default cmsLayoutConfig;
