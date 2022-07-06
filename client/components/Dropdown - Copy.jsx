import React, { useState } from 'react';
import { io } from 'socket.io-client';
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
        return;
    }

    function isItemInSelection(item) {
        if (selection.find(current => current.id === item.id)) {
            return true;
        }
        return false;
    }

    function emitData() {
        if (item.id === 1) {
            socket.emit("range", 15);
        }
        else if (item.id === 2) {
            socket.emit("range", 30);
        }
        else if (item.id === 3) {
            socket.emit("range", 60);
        }
        else {
            socket.emit("range", 120);
        }
        return;
    }

    function wrapperFunction(item) {
        handleOnClick(item);
        emitData();
        return;
    }

    return (
        <div className='dd-wrapper'>
            <div tabIndex={0} className='dd-header' role='button' onKeyPress={() => toggle(!open)} onClick={() => toggle(!open)}>
                <div className='dd-header_title'>
                    <p className='dd-header_title--bold'>{title}</p>
                    <div></div>
                </div>
                <div className='dd-header_action'>
                    <p>{open ? 'Close' : 'Open'}</p>
                </div>
                {open && (
                    <ul className='dd-list'>
                        {items.map(item => (
                            <li className='dd-list-item' key={item.id}>
                                <button type='button' onClick={() => wrapperFunction(item)}>
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