import type { Schema, Struct } from '@strapi/strapi';

export interface PagePillarCard extends Struct.ComponentSchema {
  collectionName: 'components_page_pillar_cards';
  info: {
    description: 'Five Pillars of Islam educational card';
    displayName: 'Pillar Card';
    icon: 'star';
  };
  attributes: {
    arabicName: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.String & Schema.Attribute.DefaultTo<'mosque'>;
    number: Schema.Attribute.Integer & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    transliteration: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageTimelineItem extends Struct.ComponentSchema {
  collectionName: 'components_page_timeline_items';
  info: {
    description: 'Historical milestone in the Mosque history timeline';
    displayName: 'Timeline Item';
    icon: 'calendar';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    imageUrl: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    year: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedContactInfo extends Struct.ComponentSchema {
  collectionName: 'components_shared_contact_infos';
  info: {
    description: 'Mosque physical address, phone, email, and coordinates';
    displayName: 'Contact Info';
    icon: 'pinMap';
  };
  attributes: {
    address: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Calle 80 # 30-15, Barrios Unidos'>;
    city: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Bogot\u00E1 D.C.'>;
    country: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Colombia'>;
    email: Schema.Attribute.Email;
    googleMapsUrl: Schema.Attribute.String;
    latitude: Schema.Attribute.Float & Schema.Attribute.DefaultTo<4.6685>;
    longitude: Schema.Attribute.Float & Schema.Attribute.DefaultTo<-74.0758>;
    openingHours: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Abierto todos los d\u00EDas: 4:30 AM \u2013 8:30 PM'>;
    phone: Schema.Attribute.String;
    whatsapp: Schema.Attribute.String;
  };
}

export interface SharedEtiquetteItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_etiquette_items';
  info: {
    description: 'Visitor etiquette guideline card';
    displayName: 'Etiquette Item';
    icon: 'check';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.String & Schema.Attribute.DefaultTo<'check_circle'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedOpenGraph extends Struct.ComponentSchema {
  collectionName: 'components_shared_open_graphs';
  info: {
    displayName: 'openGraph';
    icon: 'project-diagram';
  };
  attributes: {
    ogDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    ogImage: Schema.Attribute.Media<'images'>;
    ogTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    ogType: Schema.Attribute.String;
    ogUrl: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
        minLength: 50;
      }>;
    metaImage: Schema.Attribute.Media<'images'>;
    metaRobots: Schema.Attribute.String;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaViewport: Schema.Attribute.String;
    openGraph: Schema.Attribute.Component<'shared.open-graph', false>;
    structuredData: Schema.Attribute.JSON;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    description: 'Social media link';
    displayName: 'Social Link';
    icon: 'share';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    icon: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    platform: Schema.Attribute.Enumeration<
      ['facebook', 'instagram', 'youtube', 'whatsapp', 'tiktok', 'x']
    > &
      Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'page.pillar-card': PagePillarCard;
      'page.timeline-item': PageTimelineItem;
      'shared.contact-info': SharedContactInfo;
      'shared.etiquette-item': SharedEtiquetteItem;
      'shared.open-graph': SharedOpenGraph;
      'shared.seo': SharedSeo;
      'shared.social-link': SharedSocialLink;
    }
  }
}
