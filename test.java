/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Main.java to edit this template
 */
package novintfalcontest;

import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.Socket;

public class NovintFalconTest {

    public static void main(String[] args) {

        Thread hilo = new Thread(() -> {
            String serverAddress = "localhost"; // Dirección del servidor
            int port = 3005; // Puerto en el que escucha el servidor Node.js

            try (Socket socket = new Socket(serverAddress, port)) {
                // Obtener el stream de salida del socket
                OutputStream outputStream = socket.getOutputStream();
                PrintWriter writer = new PrintWriter(outputStream, true);

                // Crear un paquete de datos para enviar
                String signalData = "Este es un paquete de senales EEG ";
                int i = 0;
                while (i <= 20) {
                    // Enviar los datos al servidor
                    writer.println(signalData + i);
                    Thread.sleep(1000);
                    i++;
                }
                System.out.println("Paquete enviado: " + signalData);

            } catch (Exception e) {
                e.printStackTrace();
            }
        });
        
        hilo.start();

        String serverAddress = "localhost"; // Dirección del servidor
        int port = 3000; // Puerto en el que escucha el servidor Node.js

        try (Socket socket = new Socket(serverAddress, port)) {
            // Obtener el stream de salida del socket
            OutputStream outputStream = socket.getOutputStream();
            PrintWriter writer = new PrintWriter(outputStream, true);

            // Crear un paquete de datos para enviar
            String signalData = "Este es un paquete de senales bioelectricas ";
            int i = 0;
            while (i <= 20) {
                // Enviar los datos al servidor
                writer.println(signalData + i);
                Thread.sleep(1000);
                i++;
            }
            System.out.println("Paquete enviado: " + signalData);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
