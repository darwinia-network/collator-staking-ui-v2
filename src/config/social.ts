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
  createSocialConfig('Github', 'https://github.com/darwinia-network'),
  createSocialConfig('Twitter', 'https://twitter.com/DarwiniaNetwork'),
  createSocialConfig('Medium', 'https://medium.com/darwinianetwork'),
  createSocialConfig('Telegram', 'https://t.me/DarwiniaNetwork'),
  createSocialConfig('Discord', 'https://discord.com/invite/VcYFYETrw5'),
  createSocialConfig('Email', 'mailto:hello@darwinia.network')
];
