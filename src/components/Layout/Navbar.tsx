import ModernNavbar from '../Rbits/ModernNavbar.tsx';
import logo from '../../../logo.png';

const Navbar = () => {

  const navItems =[

    { label: 'Home', href: '/feed' },
    { label: 'Events', href: '/events' },
    { label: 'Communities', href: '/communities' },
    { label: 'Featured', href: '/practice' },
  ];
 

  return (
    <ModernNavbar
      logo={logo}
      logoAlt="Company Logo"
      items={navItems}
      logoBg="dark"
    />
  );
};

export default Navbar;
