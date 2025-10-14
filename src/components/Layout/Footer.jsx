import {
  Building,
  Github,
  Home,
  Instagram,
  Linkedin,
  LinkIcon,
  Phone,
  Twitter,
  User,
} from "lucide-react";
import React from "react";
import {
  BsInstagram,
  BsTwitch,
  BsTwitter,
  BsTwitterX,
  BsWhatsapp,
} from "react-icons/bs";
import qrInsta from "../../assets/Landing/instaqr.jpg";
import { Link } from "react-router-dom";
const Footer = () => {
  const mobileNumber = "+919368646810"; // Replace with the actual mobile number
  return (
    <footer className="dark:bg-black  w-full p-20 text-black dark:text-gray-400 ">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Logo + Tagline + QR */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <h1 className="text-xl sm:text-2xl font-bold text-green-400 flex-1">
            Hack<span className="text-black dark:text-white">Base</span>
          </h1>
          <p className="text-sm sm:text-base">
            Building India’s largest national developer community.
          </p>
          {/* Insta QR */}
          <div className="h-35 w-35 sm:h-42 sm:w-42">
            <img
              src={qrInsta}
              alt="Instagram QR"
              className="w-full h-full object-contain rounded-lg shadow-md "
            />
            <p className="text-xs mt-2 text-gray-500">
              Scan to connect on Instagram
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-5 text-sm sm:text-base ">
            <li>
              <Link to="/login" className="hover:text-green-400 flex gap-2">
                <Home />
                Home
              </Link>
            </li>
            <li>
              <Link to="/aboutus" className="hover:text-green-400 flex gap-2">
                <User />
                About Us
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-green-400 flex gap-2">
                <Building />
                Community
              </Link>
            </li>
            <li>
              <a
                href={`tel:${mobileNumber}`}
                className="hover:text-green-400 flex gap-2"
              >
                <Phone />
                Contact ({mobileNumber})
              </a>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="font-semibold mb-3">Connect</h3>
          <div className="flex justify-center md:justify-start space-x-5">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              className="hover:text-green-400"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/hack-base-2146ab384/"
              target="_blank"
              className="hover:text-green-400"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              className="hover:text-green-400"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="https://www.instagram.com/hackbase_india/"
              target="_blank"
              className="hover:text-green-400"
            >
              <Instagram className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      <p className="text-xs sm:text-sm md:text-base text-center mt-8">
        © {new Date().getFullYear()} HackBase. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
