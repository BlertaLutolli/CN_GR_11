const net = require('net');
const readline = require('readline');  
const fs = require('fs');
const path = require('path');
const os = require('os');

// Folderi që përdoret për operacione mbi skedarë
const folderPath = path.join('C:', 'Users', 'x', 'x', 'FolderName');  // Path-i i folderit 

// Lista e klientëve dhe privilegjeve
const clients = {};
const privileges = {};
let adminClient = null; 

// Krijimi i serverit TCP
const server = net.createServer((socket) => {
  let clientName = null;  // Emri i klientit
  const clientId = socket.remoteAddress + ':' + socket.remotePort;

  clients[clientId] = socket;

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
      // Komanda write <file> <content> (për shkruarje në skedar)
      else if (command[0] === 'write' && privileges[clientName] === 'privilegje te plota') {
        if (command.length < 3) {
          socket.write('Specifikoni emrin e skedarit dhe përmbajtjen për shkruarje.\n');
          return;
        }
        const filePath = path.join(folderPath, command[1]);
        const content = command.slice(2).join(' ');

        console.log(`Privilegji i klientit ${clientName}: ${privileges[clientName]}`);
        console.log(`Po shkruajmë në skedarin: ${filePath} me përmbajtje: ${content}`);

        try {
          fs.writeFileSync(filePath, content);
          socket.write(`File i shkruar me sukses: ${filePath}\n`);
        } catch (err) {
          socket.write(`Gabim gjatë shkrimit në skedar: ${err.message}\n`);
        }
      }
      // Komanda read <file> (për të lexuar një skedar)
      else if (command[0] === 'read' && (privileges[clientName] === 'privilegje te plota' || privileges[clientName] === 'privilegje te pjesshme')) {
        if (!command[1]) {
          socket.write('Specifikoni emrin e skedarit për lexim.\n');
          return;
        }
        const filePath = path.join(folderPath, command[1]);
        console.log(`Kontrollojmë për skedarin në rrugën: ${filePath}`);
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, 'utf8');
          socket.write(fileContent);
        } else {
          socket.write('File nuk ekziston.\n');
        }
      }
      // Komanda execute <file> (për të ekzekutuar një skedar)
      else if (command[0] === 'execute' && privileges[clientName] === 'privilegje te plota') {
        if (!command[1]) {
          socket.write('Specifikoni emrin e skedarit për ekzekutim.\n');
          return;
        }
        const filePath = path.join(folderPath, command[1]);
        if (fs.existsSync(filePath)) {
          try {
            const result = require('child_process').execSync(filePath).toString();
            socket.write(`Ekzekutimi përfundoi: ${result}\n`);
          } catch (execError) {
            socket.write(`Gabim gjatë ekzekutimit: ${execError.message}\n`);
          }
        } else {
          socket.write('File nuk ekziston për ekzekutim.\n');
        }
      }
      // Komanda list <folder> (për të listuar skedarët në një folder)
      else if (command[0] === 'list' && (privileges[clientName] === 'privilegje te plota' || privileges[clientName] === 'privilegje te pjesshme')) {
        const folder = command[1] ? command[1] : '.';  // Nëse nuk ka specifikim për folderin, listoni folderin aktual
        const folderPathToList = path.join(folderPath, folder);

        fs.readdir(folderPathToList, (err, files) => {
          if (err) {
            socket.write(`Gabim në hapjen e folderit: ${err.message}\n`);
          } else {
            socket.write(`Përmbajtja e folderit ${folderPathToList}: \n${files.join('\n')}\n`);
          }
        });
      }
      // Komanda create <file> <content> (për të krijuar një skedar të ri)
      else if (command[0] === 'create' && privileges[clientName] === 'privilegje te plota') {
        if (command.length < 3) {
          socket.write('Specifikoni emrin e skedarit dhe përmbajtjen për krijim.\n');
          return;
        }
        const filePath = path.join(folderPath, command[1]);
        const content = command.slice(2).join(' ');

        try {
          fs.writeFileSync(filePath, content);
          socket.write(`Skedari i krijuar: ${filePath}\n`);
        } catch (err) {
          socket.write(`Gabim gjatë krijimit të skedarit: ${err.message}\n`);
        }
      }
    
    // Komanda delete <file> (për të fshirë një skedar)
    else if (command[0] === 'delete' && privileges[clientName] === 'privilegje te plota') {
      if (!command[1]) {
        socket.write('Specifikoni emrin e skedarit për fshirje.\n');
        return;
      }
      const filePath = path.join(folderPath, command[1]);

      try {
        fs.unlinkSync(filePath);
        socket.write(`Skedari i fshirë: ${filePath}\n`);
      } catch (err) {
        socket.write(`Gabim gjatë fshirjes së skedarit: ${err.message}\n`);
      }
    }
    else {
      socket.write('Komandë e pavlefshme.\n');
    }
  }
});

socket.on('close', () => {
  delete clients[clientName];  // Hiq klientin nga lista kur largohet
  console.log(`Klienti ${clientName} u largua.`);
});

socket.on('error', (err) => {
  console.error(`Gabim i ndodhur gjatë lidhjes me klientin.`);
});
});
// Funksioni për të dërguar mesazhe për një klient të caktuar
function sendMessageToClient(clientName, message, senderName) {
const clientSocket = clients[clientName];
if (clientSocket) {
  clientSocket.write(`Mesazh privat nga ${senderName}: ${message}\n`);
} else {
  console.log(`Klienti ${clientName} nuk është i lidhur.`); 
}
}

// Funksioni për të dërguar mesazhe për të gjithë klientët
function broadcastMessage(message, senderName) {
for (const clientName in clients) {
  const clientSocket = clients[clientName];
  clientSocket.write(`Mesazh i dërguar nga ${senderName} për të gjithë: ${message}\n`);
}
}

// Serveri dëgjon në portin 3000
server.listen(3000, '127.0.0.1', () => {
console.log('Serveri është duke dëgjuar në portin 3000.');
console.log('Komandat që mund të shkruani në terminalin e serverit:');
console.log('- chat <clientName> <mesazh> : Dërgon mesazh privat për një klient të caktuar.');
console.log('- broadcast <mesazh>     : Dërgon mesazhin për të gjithë klientët.');

// Përdorim readline për të lejuar komanda nga terminali i serverit
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Komanda për të dërguar mesazh broadcast nga terminali i serverit
rl.on('line', (input) => {
  if (input.startsWith('broadcast ')) {
    const message = input.slice(10);  // Merr mesazhin pas 'broadcast'
    broadcastMessage(message, 'server');
    console.log(`Mesazh i dërguar për të gjithë: ${message}`);
  }
});
});