import React from 'react';

//define types for metric card props
export interface CardProp {
	title: string, 
	value: number | null
}

//define types for graph props
export interface GraphProp {
	title: string,
	datapoints: {
		x: number[],
		y: number[]
	},
	color: string
}

