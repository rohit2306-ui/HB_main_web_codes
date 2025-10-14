import PillNav from '../Rbits/PillNavbar.jsx';
import logo from '../../../logo.png';

const Navbar = () => {

  const navItems =[

    { label: 'Home', href: '/feed' },
    { label: 'Events', href: '/events' },
    { label: 'Communities', href: '/communities' },
        { label: 'Featured', href: '/practice' },
  ];
 

  return (
    <nav className="w-full   fixed p-2 top-1 left-0 z-50 mb-12 ">
     

<PillNav
  logo={logo}
  logoAlt="Company Logo"
  initialLoadAnimation
  items={navItems}
  activeHref="/"
  ease="power2.easeOut"
  baseColor="#fff"
  pillColor="#3b82f6"
  hoveredPillTextColor="#3b82f6"
  pillTextColor="#fff"
/>

    </nav>
  );
};

export default Navbar;
