import React, { useState } from 'react';
import { io } from 'socket.io-client';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import socket from '../socket';

function Dropdown({title, items = [], multiSelect = false}) {
    const [open, setOpen] = useState(false);
    const [selection, setSelection] = useState([]);
    const toggle = () => setOpen(!open);
    function handleOnClick(item) {
        if (!selection.some(current => current.id === item.id)) {
            if (!multiSelect) {
              setSelection([item]);
            }
            else if (multiSelect) {
                setSelection([...selection, item])
            }
            else {
                let selectionAfterRemoval = selection;
                selectionAfterRemoval = selectionAfterRemoval.filter(
                    current => current.id !== item.id
                );
                setSelection([...selectionAfterRemoval]);
            }
        }
        
        
        if (item.id === 1) {
            socket.emit("range", '15');
            console.log('Emitting 1');
        }
        else if (item.id === 2) {
            socket.emit("range", '30');
            console.log('Emitting 2');
        }
        else if (item.id === 3) {
            socket.emit("range", '60');
            console.log('Emitting 3');
        }
        else {
            socket.emit("range", '360');
            console.log('Emitting 4');
        }
        return;
    }

    function isItemInSelection(item) {
        if (selection.find(current => current.id === item.id)) {
            return true;
        }
        return false;
    }

    function emitData(item) {
        if (item.id === 1) {
            socket.emit("range", '15');
            console.log('Emitting');
        }
        else if (item.id === 2) {
            socket.emit("range", '30');
            console.log('Emitting');
        }
        else if (item.id === 3) {
            socket.emit("range", '60');
            console.log('Emitting');
        }
        else {
            socket.emit("range", '360');
            console.log('Emitting');
        }
        return;
    }

    return (
        <div className='dd-wrapper'>
            <div tabIndex={0} className='dd-header' role='button' onKeyPress={() => toggle(!open)} onClick={() => toggle(!open)}>
                <div className='dd-header_title'>
                    <p className='dd-header_title--bold'>{title}</p>
                    <KeyboardArrowDownIcon />
                    <div></div>
                </div>
                {open && (
                    <ul className='dd-list'>
                        {items.map(item => (
                            <li className='dd-list-item' key={item.id}>
                                <button type='button' onClick={() => handleOnClick(item)}>
                                    <span>{item.value}</span>
                                    <span>{isItemInSelection(item) && ' (Selected)'}</span>
                                </button>
                            </li>    
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default Dropdown;