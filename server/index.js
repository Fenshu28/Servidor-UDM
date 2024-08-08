const net = require('net');
const io = require('socket.io');
const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
const serverHttp = http.createServer(app);

// Configuración de CORS para Express
app.use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
}));

// Configuración de CORS para Socket.IO
const socketIo = io(serverHttp, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"]
    }
});

let tcpServers = {};
let openSockets = [];

socketIo.on('connection', (socket) => {
    console.log('Cliente conectado');

    socket.emit('updateSockets', openSockets);

    socket.on('openSocket', (port) => {
        console.log('Solicitud para abrir un nuevo socket en el puerto:', port);



        // Abrir un nuevo servidor TCP en el puerto especificado
        const server = net.createServer((tcpSocket) => {
            tcpSocket.on('data', (data) => {
                console.log('Datos recibidos:', data.toString());
                socket.emit('signalData', data.toString());
            });
        });

        server.listen(port, () => {
            console.log(`Nuevo servidor TCP escuchando en el puerto ${port}`);
            tcpServers[port] = server;
            openSockets.push(port);
            socketIo.emit('updateSockets', openSockets);
        });
    });

    socket.on('deleteSocket', (port) => {
        // Cerrar el servidor TCP actual en ese puerto si existe
        if (tcpServers[port]) {
            tcpServers[port].close(() => {
                console.log(`Servidor TCP en el puerto ${port} cerrado`);
                delete tcpServers[port];
                openSockets = openSockets.filter(p => p !== port);
                socketIo.emit('updateSockets', openSockets);
            });
        }
    })

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

serverHttp.listen(4000, () => {
    console.log('Servidor HTTP escuchando en el puerto 4000');
});
