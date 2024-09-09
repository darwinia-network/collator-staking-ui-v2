import Collator from './collator';
import FooterSocials from './footer-socials';

const currentYear = new Date().getUTCFullYear();

const Footer = () => {
  return (
    <footer className="flex h-[var(--footer-height)] w-full items-center py-[var(--footer-padding-y)]">
      <div className="max-auto flex w-full items-center justify-center px-[var(--container-padding-x)] md:justify-between">
        <span className="text-[0.875rem] font-normal capitalize text-foreground/50">
          &copy; {currentYear} Darwinia Network
        </span>

        <div className="hidden gap-5 md:flex md:items-center">
          <FooterSocials />
          <Collator />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
