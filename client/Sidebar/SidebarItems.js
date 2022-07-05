import React from "react";
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StreamIcon from '@mui/icons-material/Stream';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import CompassCalibrationIcon from '@mui/icons-material/CompassCalibration';

export const SidebarItems = [
	{
		title: 'Connect',
		path: '/connect',
		icon: <CompassCalibrationIcon />
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