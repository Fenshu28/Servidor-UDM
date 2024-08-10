import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const Dashboard = () => {
    const [sockets, setSockets] = useState([]);
    const [port, setPort] = useState('');
    const [socket, setSocket] = useState(null);
    const [signals, setSignals] = useState({}); // Para almacenar señales por puerto

    useEffect(() => {
        const newSocket = io('http://localhost:4000');
        setSocket(newSocket);

        newSocket.on('updateSockets', (openSockets) => {
            setSockets(openSockets);
        });

        newSocket.on('signalData', (data) => {
            const { port, signal } = JSON.parse(data); // Suponiendo que los datos vienen en formato JSON
            setSignals((prevSignals) => ({
                ...prevSignals,
                [port]: (prevSignals[port] || []).concat(signal)
            }));
        });

        return () => newSocket.close();
    }, [setSocket]);

    const handleOpenSocket = () => {
        if (socket) {
            socket.emit('openSocket', port);
            setPort('');
        }
    };

    const handleRemoveSocket = (port) => {
        if (socket) {
            socket.emit('closeSocket', port);
            setSignals((prevSignals) => {
                const { [port]: removed, ...rest } = prevSignals;
                return rest;
            });
        }
    };

    return (
        <div className="container mt-4">
            <header className="bg-primary text-white text-center py-3 mb-4">
                <h1>Sistema Unificador de Señales</h1>
            </header>
            <div className='row'>
                <div className='col-md-4'>
                    <div className="card">
                        <div className="card-header">
                            <h5>Sockets</h5>
                        </div>
                        <div className="card-body">
                            <p>Abre nuevos sockets para otros tipos de señales:</p>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="port">Número de Puerto</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="port"
                                        value={port}
                                        onChange={(e) => setPort(e.target.value)}
                                        placeholder="Ingrese el número de puerto"
                                    />
                                </div>
                                <button type="button" className="btn btn-primary mt-2" onClick={handleOpenSocket}>Abrir Socket</button>
                            </form>
                            <ul className="list-group mt-4">
                                {sockets.map((port) => (
                                    <li key={port} className="list-group-item d-flex justify-content-between align-items-center">
                                        Puerto {port}
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleRemoveSocket(port)}
                                            aria-label="Eliminar socket"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className='card'>
                        <div className='card-header'>
                            Señales recibidas por cada puerto
                        </div>
                        <div className='card-body'>
                            <div className="mt-4">
                                {sockets.map((port) => (
                                    <div key={port} className="mb-4">
                                        <h6>Puerto {port}</h6>
                                        <div className="border p-2">
                                            {signals[port] ? signals[port].map((signal, index) => (
                                                <p key={index}>{signal}</p>
                                            )) : <p>Aun no se han recibido señales :(</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Dashboard;
