'use client';

import React, { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { getSocket } from '@/lib/utils/socket';

interface DropdownItem {
  id: number;
  value: string;
}

interface DropdownProps {
  title: string;
  items?: DropdownItem[];
  multiSelect?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ title, items = [], multiSelect = false }) => {
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState<DropdownItem[]>([]);
  const socket = getSocket();

  const toggle = () => setOpen(!open);

  const handleOnClick = (item: DropdownItem) => {
    if (!selection.some((current) => current.id === item.id)) {
      if (!multiSelect) {
        setSelection([item]);
      } else {
        setSelection([...selection, item]);
      }
    }

    // Emit range based on item ID
    const rangeMap: Record<number, string> = {
      1: '15',
      2: '30',
      3: '60',
      4: '360',
    };

    const range = rangeMap[item.id] || '360';
    socket.emit('range', range);
  };

  const isItemInSelection = (item: DropdownItem): boolean => {
    return selection.some((current) => current.id === item.id);
  };

  return (
    <div className="dd-wrapper">
      <div
        tabIndex={0}
        className="dd-header"
        role="button"
        onKeyPress={() => toggle()}
        onClick={() => toggle()}
      >
        <div className="dd-header_title">
          <p className="dd-header_title--bold">{title}</p>
          <KeyboardArrowDownIcon />
        </div>
        {open && (
          <ul className="dd-list">
            {items.map((item) => (
              <li className="dd-list-item" key={item.id}>
                <button type="button" onClick={() => handleOnClick(item)}>
                  <span>{item.value}</span>
                  <span>{isItemInSelection(item) && ' (Selected)'}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dropdown;

