import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIpaddress } from '../reducers/connectSlice';
import { SidebarItems } from './SidebarItems';
import { v4 as uuidv4 } from 'uuid';

const Sidebar = () => {

	const navItems = SidebarItems.map((item, i) => {
		return (
			<li className="nav-item" key={uuidv4()}>
				<Link to={item.path}>
					{item.icon}
					<span>{item.title}</span>
				</Link>
			</li>
		)
	});


	return (
		<div className="sidebar">
			<div className="nav-header">
				Metamorphosis
			</div>
			<nav className="main-nav">
				<ul className="nav-items">
					{navItems}
				</ul>
			</nav>
		</div>
	)
}

export default Sidebar;