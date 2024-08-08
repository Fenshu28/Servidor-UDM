import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const Dashboard = () => {
    const [signalData, setSignalData] = useState('');
    const [socket, setSocket] = useState(null);
    const [portNumber, setPortNumber] = useState('');
    const [openSockets, setOpenSockets] = useState([]);

    useEffect(() => {
        // Conectar al servidor de socket.io
        const socketConnection = io('http://localhost:4000');
        setSocket(socketConnection);

        // Manejar la recepción de datos
        socketConnection.on('signalData', (data) => {
            setSignalData(data);
        });

        // Manejar la actualización de sockets abiertos
        socketConnection.on('updateSockets', (sockets) => {
            setOpenSockets(sockets);
        });

        return () => {
            socketConnection.disconnect();
        };
    }, []);

    const handleOpenSocket = () => {
        if (socket && portNumber) {
            socket.emit('openSocket', portNumber);
        }
    };

    const handleRemoveSocket = (port) => {
        if (socket) {
            socket.emit('deleteSocket', port);
        }
    };

    const handleInputChange = (event) => {
        setPortNumber(event.target.value);
    };

    return (
        <div className="container-fluid">
            <header className="bg-primary text-white text-center py-3 mb-4">
                <h1>Sistema Unificador de Señales</h1>
            </header>
            <div className="row">
                <div className="col-md-4">
                    <div className="card bg-dark text-white mb-4">
                        <div className="card-header">
                            Panel de Control
                        </div>
                        <div className="card-body">
                            <p>Abre nuevos sockets para otros tipos de señales:</p>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="portNumber">Número de Puerto</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="portNumber"
                                        placeholder="Ingrese el número de puerto"
                                        value={portNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <button type="button" className="btn btn-primary" onClick={handleOpenSocket}>Abrir Socket</button>
                            </form>
                            <h5 className="mt-4">Sockets Abiertos</h5>
                            <ul className="list-group">
                                {openSockets.map((port, index) => (
                                    <li key={index} className="list-group-item">
                                        <div className='row'>
                                        <div className='col-10'>
                                            Puerto: {port}
                                        </div>
                                        <div className='col-2'>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleRemoveSocket(port)}
                                                aria-label="Eliminar socket"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div></div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card bg-dark text-white">
                        <div className="card-header">
                            Datos de Señal
                        </div>
                        <div className="card-body">
                            <p>Aquí se mostrarán los datos de las señales recibidas.</p>
                            <div id="signalData" className="alert alert-info" role="alert">
                                {signalData || 'Esperando datos...'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
