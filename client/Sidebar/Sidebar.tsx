import React, { useState } from 'react';
import * as logo from '../assets/logo.png';
import { SidebarItems } from './SidebarItems';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StreamIcon from '@mui/icons-material/Stream';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { NavLink } from 'react-router-dom';

type SBAppProps = {
    children?:
    | React.ReactNode
    | React.ReactNode[];
  }; /* use `interface` if exporting so that consumers can extend */
type Open = {
    isOpen: boolean, 
    setIsOpen: boolean
}


const Sidebar = ({children}: {children: React.ReactNode}) => {
    const[isOpen , setIsOpen] = useState<boolean>(true); // not sure about this one //Open deleted
    const toggle = () => setIsOpen (!isOpen);

    return (
        <div className="container">
           <div style={{width: isOpen ? "150px" : "50px"}} className="sidebar">
               <div className="nav-header">
                   <img style={{display: isOpen ? "block" : "none"}} className="logo" src={logo} alt="logo"/>
                   <div style={{marginLeft: isOpen ? "50px" : "0px"}} className="collapse-icon">
                       {isOpen? <ArrowBackIosIcon onClick={toggle}/> : <ArrowForwardIosIcon onClick={toggle}/>}
                   </div>
               </div>
               {
                // function MyCard(props: { param1: ObjectDto, toggleFunction: any }) {}

                   SidebarItems.map((item, index)=>(
                       <NavLink to={item.path} key={index} className="nav-link" activeclassName="active">
                           <div className="icon">{item.icon}</div>
                           <div style={{display: isOpen ? "block" : "none"}} className="nav-title">{item.title}</div>
                       </NavLink>
                   ))
               }
           </div>
           <main>{children}</main>
        </div>
    );
};

export default Sidebar;