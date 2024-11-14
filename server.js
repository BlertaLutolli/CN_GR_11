const net = require('net');
const readline = require('readline');  
const fs = require('fs');
const path = require('path');
const os = require('os');

// Folderi që përdoret për operacione mbi skedarë
const folderPath = path.join('C:', 'Users', 'bleri', 'OneDrive', 'Desktop', 'New1');  
// Lista e klientëve dhe privilegjeve
const clients = {};
const privileges = {};
let adminClient = null; 

// Krijimi i serverit TCP
const server = net.createServer((socket) => {
  let clientName = null;  // Emri i klientit
  const clientId = socket.remoteAddress + ':' + socket.remotePort;

  clients[clientId] = socket;

  socket.write('Ju lutem, shkruani emrin tuaj: \n');
  socket.on('data', (data) => {
    const message = data.toString().trim();

    if (!clientName) {
      clientName = message;
      delete clients[clientId];  
      clients[clientName] = socket; 

      privileges[clientName] = clientName === 'admin' ? 'privilegje te plota' : 'privilegje te pjesshme'; // Admin ose lexues

      // Dërgo mesazhin e privilegjeve
      socket.write(`Përshëndetje ${clientName}, keni ${privileges[clientName]}\n`);

      socket.write(`
  Komandat që mund të përdorni:
  - broadcast <mesazh>:Dërgon mesazh për të gjithë
  - chat <emriKlientit> <mesazh>:Dërgon mesazh privat për një klient tjetër
  - read <emriSkedarit>:Lexon skedarin
  Ne rastin e admin-it:
  - write <emriSkedarit> <përmbajtje>:Shkruan në skedar
  - execute <emriSkedarit>:Ekzekuton një skedar
  - list <folder>:Lista skedarët në një folder
  - create <emriSkedarit> <përmbajtje>:Krijon skedar të ri
  - delete <emriSkedarit>:Fshin një skedar
    `);
   
      console.log(`Klienti me emrin ${clientName} është lidhur.`);
    } else {

      const command = message.split(' ');

      if (command[0] === 'chat' && command.length > 2) {
        const targetClient = command[1];
        const chatMessage = message.slice(6 + targetClient.length);  

        if (clients[targetClient]) {
          sendMessageToClient(targetClient, chatMessage, clientName); 
          socket.write(`Mesazhi dërguar për klientin ${targetClient}: ${chatMessage}\n`);
        } else {
          socket.write(`Klienti ${targetClient} nuk është i lidhur.\n`);
        }
      }
      // Komanda broadcast <message> (për dërgimin e mesazheve për të gjithë klientët)
      else if (command[0] === 'broadcast' && command.length > 1) {
        const broadcastMessageText = message.slice(10);  
        broadcastMessage(broadcastMessageText, clientName); 
        console.log(`Mesazhi i dërguar nga ${clientName} për të gjithë: ${broadcastMessageText}`); 
      }