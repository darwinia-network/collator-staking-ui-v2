type SocialConfig = {
  url: string;
  name: string;
  darkIconPath: string;
  lightIconPath: string;
};

function createSocialConfig(name: string, url: string): SocialConfig {
  return {
    name,
    url,
    darkIconPath: `/images/social/${name.toLowerCase()}-dark.svg`,
    lightIconPath: `/images/social/${name.toLowerCase()}-light.svg`
  };
}

export const socialConfig: SocialConfig[] = [
  createSocialConfig('Github', 'https://github.com/ringecosystem'),
  createSocialConfig('Twitter', 'https://x.com/ringecosystem')
];
