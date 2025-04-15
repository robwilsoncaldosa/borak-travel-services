export interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

export interface LogoProps {
  imageSrc: string;
  altText: string;
  title: string;
}

export interface HeaderProps {
  logo: LogoProps;
  navLinks: NavLinkProps[];
}