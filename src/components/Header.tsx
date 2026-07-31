import React from 'react';
import { Icon } from 'zmp-ui';
import { useNavigate } from 'react-router-dom';
import { navigateBack } from '@/utils/navigation';
import logoSgs from '@/assets/logo-sgs.png';

type HeaderProps = { variant: 'logo' } | { variant: 'back'; title: string };

const Header: React.FC<HeaderProps> = (props) => {
  const navigate = useNavigate();

  if (props.variant === 'logo') {
    return (
      <header className="z-20 bg-black text-white">
        <div className="flex h-14 items-center justify-between px-4">
          <img
            src={logoSgs}
            alt="SGS"
            className="h-9 w-auto object-contain object-left"
          />
          {/* <span className="font-display text-[11px] font-semibold tracking-[0.14em] text-white/70 uppercase">
            Academy
          </span> */}
        </div>
      </header>
    );
  }

  return (
    <header className="z-20 border-b border-sgs-border bg-sgs-white">
      <div className="flex h-12 items-center gap-1 px-2">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center text-sgs-black"
          onClick={() => navigateBack(navigate)}
          aria-label="Back"
        >
          <Icon icon="zi-arrow-left" size={22} />
        </button>
        <span className="font-display text-[15px] font-semibold text-sgs-black">{props.title}</span>
      </div>
    </header>
  );
};

export default Header;
