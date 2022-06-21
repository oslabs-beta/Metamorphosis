import React from "react";
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StreamIcon from '@mui/icons-material/Stream';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';

export const SidebarItems = [
	{
		title: 'Home',
		path: '/',
		icon: <HomeIcon />
	},
	{
		title: 'Broker',
		path: '/broker',
		icon: <DashboardIcon />
	},
	{
		title: 'Producer',
		path: '/producer',
		icon: <StreamIcon />
	},	
	{
		title: 'Consumer',
		path: '/consumer',
		icon: <MoveToInboxIcon />
	}
]