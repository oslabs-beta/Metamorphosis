// /**
//  * @jest-environment node 
//  */
// // import dependencies
// import React from 'React'
// // import API mocking utilities from Mock Service Worker
// // import {rest} from 'msw'
// // import {setupServer} from 'msw/node'
// // import react-testing methods
// import {render, fireEvent, waitFor, screen} from '@testing-library/react'
// // add custom jest matchers from jest-dom
// import '@testing-library/jest-dom'
// // the component to test
// import Connection from '../ConnectionPage/Connection.tsx'

import React from 'React';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
import regeneratorRuntime from 'regenerator-runtime';

import App from '../App';
import Connection from '../ConnectionPage/Connection.jsx';
import MetricCard from '../components/charts/MetricCard';
import store from '../store';

/*
TESTS:
1. Connection page
    i. check for input fields and labels
    ii. check for button and to have text "Connect"
2. Metric Card
    i. Initialize props
    ii. Check that text matches the text passed in props
    iii. Data values that exceed normal values should be rendered different color
3. Line Graph 
    i. Initialize line graph with props
    ii. Check that title matches props title
4. Broker Page (pass props)
    i. Check for metric cards (4) with the titles that were given
    ii. Check for charts (5) with the tites that were given

React-redux integration tests
1. Empty state before interactions
2. Page loads with 2 input fields and buttons
3. Dispatch the ip address and port and check that state matches after dispatch
*/

describe('Unit testing React components', () => {
  describe('ConnectionPage', ()=> {
    let container;

    beforeAll(() => {
        container = render(<Connection />);
    })

    //should render 2 input fields, one for ip address, one for port
    test('Render input fields', ()=> {
        expect(container.getElementsByClassName('ip-input')).toBeInTheDocument();
    })

    //should render connect button
    test('Render button', ()=> {

    })
  });

  describe('Metric Card', ()=> {
    let container;
    let props = {
      data: {
          title: 'Test',
          value: 5
      },
      normalVal: 4
    };

    beforeAll(() => {
        container = render(<MetricCard />);
    })

    //check that title of card is matching
    test('Render passed-in text', ()=> {
        // matches title
        // sibling should match value
        // sibling should have styling to "alert" user
    })
  });
  

})
