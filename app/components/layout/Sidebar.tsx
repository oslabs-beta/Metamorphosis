'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StreamIcon from '@mui/icons-material/Stream';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import CompassCalibrationIcon from '@mui/icons-material/CompassCalibration';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Image from 'next/image';

interface SidebarItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

import NotificationsIcon from '@mui/icons-material/Notifications';

const sidebarItems: SidebarItem[] = [
  {
    title: 'Connect',
    path: '/connect',
    icon: <CompassCalibrationIcon />,
  },
  {
    title: 'Broker',
    path: '/broker',
    icon: <DashboardIcon />,
  },
  {
    title: 'Producer',
    path: '/producer',
    icon: <StreamIcon />,
  },
  {
    title: 'Consumer',
    path: '/consumer',
    icon: <MoveToInboxIcon />,
  },
  {
    title: 'Alerts',
    path: '/alerts',
    icon: <NotificationsIcon />,
  },
];

interface SidebarProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ children, isAuthenticated = true }) => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const toggle = () => setIsOpen(!isOpen);

  return (
    <nav className="container">
      <div style={{ width: isOpen ? '150px' : '50px' }} className="sidebar">
        <div className="nav-header">
          {isOpen && (
            <Image
              src="/images/logo.png"
              alt="logo"
              width={100}
              height={40}
              className="logo"
            />
          )}
          <div
            style={{ marginLeft: isOpen ? '50px' : '0px' }}
            className="collapse-icon"
          >
            {isOpen ? (
              <ArrowBackIosIcon onClick={toggle} />
            ) : (
              <ArrowForwardIosIcon onClick={toggle} />
            )}
          </div>
        </div>
        <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
          <div className="icon">
            <HomeIcon />
          </div>
          {isOpen && <div className="nav-title">Home</div>}
        </Link>

        {isAuthenticated &&
          sidebarItems.map((item, index) => (
            <Link
              href={item.path}
              key={index}
              className={`nav-link ${pathname === item.path ? 'active' : ''}`}
            >
              <div className="icon">{item.icon}</div>
              {isOpen && <div className="nav-title">{item.title}</div>}
            </Link>
          ))}
      </div>
      <main>{children}</main>
    </nav>
  );
};

export default Sidebar;

