import { socialConfig } from "@/config/social";

const FooterSocials = () => {
  return (
    <div className="flex items-center justify-center gap-4 md:justify-start md:gap-5">
      {socialConfig.map(({ url, name, darkIconPath, lightIconPath }) => (
        <a
          key={name}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative size-4 transition-opacity hover:opacity-[var(--nextui-hover-opacity)] active:scale-95 active:opacity-[var(--nextui-hover-opacity)] md:size-5"
        >
          <img
            src={darkIconPath}
            alt={`${name} icon`}
            loading="lazy"
            className="hidden dark:block"
          />
          <img
            src={lightIconPath}
            alt={`${name} icon`}
            loading="lazy"
            className="dark:hidden"
          />
        </a>
      ))}
    </div>
  );
};

export default FooterSocials;
