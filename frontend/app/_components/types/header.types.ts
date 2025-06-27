export interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  className?: string;
}

export interface LogoProps {
  imageSrc: string;
  altText: string;
  title: string;
  className?: string;
}

export interface HeaderProps {
  logo: LogoProps;
  navLinks: NavLinkProps[];
}