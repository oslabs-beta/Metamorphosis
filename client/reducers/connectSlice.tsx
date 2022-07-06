import { createSlice } from '@reduxjs/toolkit';

//REDUCER FUNCTION
export const connectSlice = createSlice({
  name: 'connect',
  //define initial state
  initialState: {
    ipaddress: '',
    port:''
  },
  
  //reducer functions
  reducers: {

    connectAddress: (state, action) => {
			const { ipaddress, port } = action.payload;
			state.ipaddress = ipaddress;
			state.port = port;
    },

    disconnectAddress: (state, action) => {

    }

  },

})


export const { connectAddress, disconnectAddress } = connectSlice.actions;


//SELECTORS TO INCLUDE
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectIpaddress = (state: { connect: { ipaddress: string; }; }) => state.connect.ipaddress;
export const selectPort = (state: { connect: { port: string; }; }) => state.connect.port;

export default connectSlice.reducer