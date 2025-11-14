'use client';

import React, { useState } from 'react';
import Sidebar from '@/app/components/layout/Sidebar';
import { getSocket } from '@/lib/utils/socket';
import '@/app/styles/main.scss';

const ConnectPage: React.FC = () => {
  const [connection, setConnection] = useState({
    ipaddress: '',
    port: '',
  });

  const [ipError, setIpError] = useState(false);
  const [portError, setPortError] = useState(false);
  const [connectError, setConnectError] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const isIP = (str: string): boolean => {
    const block = str.split('.');
    if (block.length === 4) {
      return block.every((el) => {
        const num = parseInt(el, 10);
        return num >= 0 && num <= 255;
      });
    } else if (block[0] === 'localhost') {
      return true;
    }
    return false;
  };

  const isPort = (str: string): boolean => {
    const port = parseInt(str, 10);
    return port >= 1 && port <= 65535;
  };

  const onConnect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setConnection({
      ...connection,
      [name]: value,
    });

    setIpError(false);
    setPortError(false);
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();

    const { ipaddress, port } = connection;

    if (!isIP(ipaddress)) {
      setIpError(true);
      return;
    }

    if (!isPort(port)) {
      setPortError(true);
      return;
    }

    try {
      const socket = getSocket();
      socket.connect();

      socket.on('data', (data) => {
        if (data) {
          setIsConnected(true);
          // Store connection info (you might want to use state management or localStorage)
          localStorage.setItem('prometheusUrl', `${ipaddress}:${port}`);
        }
      });

      socket.on('connect_error', () => {
        setConnectError(true);
        setIsConnected(false);
      });

      socket.emit('ip', `${ipaddress}:${port}`);
    } catch (error) {
      setConnectError(true);
    }

    setConnection({
      ipaddress: '',
      port: '',
    });
  };

  const handleDisconnect = () => {
    const socket = getSocket();
    socket.disconnect();
    setIsConnected(false);
    localStorage.removeItem('prometheusUrl');
  };

  return (
    <Sidebar isAuthenticated={true}>
      <div className="connect">
        {!isConnected ? (
          <div className="home-form">
            <form className="connect-form" onSubmit={handleConnect}>
              <div className="connect-inputs">
                <label htmlFor="ipaddress" className="ip-label">
                  IP Address:{' '}
                </label>
                <input
                  id="ipaddress"
                  type="text"
                  name="ipaddress"
                  className="ip-input"
                  placeholder="Enter your IP address"
                  value={connection.ipaddress}
                  onChange={onConnect}
                />
              </div>

              <div className="connect-inputs">
                <label htmlFor="port" className="port-label">
                  PORT:{' '}
                </label>
                <input
                  id="port"
                  type="text"
                  name="port"
                  className="port-input"
                  placeholder="Enter your PORT"
                  value={connection.port}
                  onChange={onConnect}
                />
              </div>
              <div className="form-input-btn">
                <button
                  id="connectBtnConnection"
                  className="connect-form-btn"
                  type="submit"
                >
                  Connect
                </button>
              </div>
              {ipError && portError ? (
                <p className="Error" style={{ color: '#FF3D2E' }}>
                  Invalid IP Address and PORT
                </p>
              ) : ipError ? (
                <p className="Error" style={{ color: '#FF3D2E' }}>
                  Invalid IP Address
                </p>
              ) : portError ? (
                <p className="Error" style={{ color: '#FF3D2E' }}>
                  Invalid PORT
                </p>
              ) : connectError ? (
                <p className="Error" style={{ color: '#FF3D2E' }}>
                  Unable to connect
                </p>
              ) : null}
            </form>
          </div>
        ) : (
          <div className="form-input-btn">
            <button
              className="connect-form-btn"
              type="button"
              onClick={handleDisconnect}
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default ConnectPage;

