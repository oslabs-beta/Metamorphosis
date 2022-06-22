import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png' 
import { SidebarItems } from './SidebarItems';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { v4 as uuidv4 } from 'uuid';

const Sidebar = () => {
	// const [toggle, setToggle] = useState(false);

	// const toggleSidebar = () => setToggle(!toggle);

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
			<nav className="main-nav">
				<ul className="nav-items" >
					{navItems}
				</ul>
			</nav>
		</div>
	)
}

export default Sidebar;