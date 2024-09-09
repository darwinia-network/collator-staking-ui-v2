import { Link } from '@tanstack/react-router';

import { HeaderControls } from './header-controls';

const Header = () => {
  return (
    <header className="h-[var(--header-height)] w-full py-[var(--header-padding-y)]">
      <div className="mx-auto flex h-full w-full items-center justify-between px-[var(--container-padding-x)]">
        <Link
          href="/"
          title="darwinia"
          className="relative h-[1.375rem] w-[6.78156rem] object-contain md:inline"
        >
          <img src={'/images/common/logo.svg'} alt="darwinia logo" className="absolute shrink-0" />
        </Link>
        <HeaderControls />
      </div>
    </header>
  );
};
export default Header;
