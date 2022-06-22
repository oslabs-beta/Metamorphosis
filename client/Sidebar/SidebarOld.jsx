import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/logo.png' 
import { SidebarItems } from './SidebarItems';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { v4 as uuidv4 } from 'uuid';


const Sidebar = ({children}) => {
	const [toggle, setToggle] = useState(true);

	const toggleSidebar = () => setToggle(!toggle);

	const navItems = SidebarItems.map((item, i) => {
		return (
			<li className="nav-item" key={uuidv4()}>
				<Link className="nav-link" to={item.path}>
					{item.icon}
					<p className='nav-title'>{item.title}</p>
					{/* {toggle? null: <p className='nav-title'>{item.title}</p>} */}
					{/* <span className="nav-span">{item.title}</span> */}
				</Link>
			</li>
		)
	});


	return (
		<div className="sidebar">
		{/* <div className={toggle? "sidebar-collapse": "sidebar"}> */}
			<div className="nav-header">

			{/* {toggle? <ArrowForwardIosIcon onClick={toggleSidebar}/> : <ArrowBackIosIcon className="collapse-icon" onClick={toggleSidebar}/>} */}
			{/* {toggle? null: <img className="sidebar-logo" src={logo} />} */}
			<img className="sidebar-logo" src={logo} />
			</div>
				<ul className="nav-items" >
					{navItems}
				</ul>
		</div>
	)

// 	return (
// 		<div className="container">
// 			 <div style={{width: toggle ? "200px" : "50px"}} className="sidebar">
// 					 <div className="top_section">
// 							 <img style={{display: toggle ? "block" : "none"}} className="sidebar-logo" src={logo} />
// 							 <div style={{marginLeft: toggle ? "50px" : "0px"}} className="bars">
// 							{toggle? <ArrowForwardIosIcon onClick={toggleSidebar}/> : <ArrowBackIosIcon className="collapse-icon" onClick={toggleSidebar}/>} 
// 							 </div>
// 					 </div>
// 					 {
// 							 SidebarItems.map((item, index)=>(
// 									 <NavLink to={item.path} key={index} className="link" activeclassName="active">
// 											 <div className="icon">{item.icon}</div>
// 											 <div style={{display: toggle ? "block" : "none"}} className="link_text">{item.title}</div>
// 									 </NavLink>
// 							 ))
// 					 }
// 			 </div>
// 			 <main>{children}</main>
// 		</div>
// );
}

export default Sidebar;