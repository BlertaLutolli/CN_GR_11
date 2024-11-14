const net = require('net');
const readline = require('readline');  // Përdorim readline për të lexuar inputet nga terminali i klientit

// Lidhja me serverin
const client = new net.Socket();
const serverPort = 3000; // Porti ku është serveri
const serverHost = '127.0.0.1'; // Adresa IP e serverit

// Krijimi i një interface për të lexuar komandat nga tastiera
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Funksioni për të dërguar komandë tek serveri
function sendCommand(command) {
  if (client.readyState === 'open') {
    client.write(command);
  } else {
    console.log("Serveri nuk është i lidhur.");
  }
}

// Lidhja me serverin
client.connect(serverPort, serverHost, () => {
  console.log('I lidhur me serverin...');
  rl.question('Shkruani emrin tuaj: ', (name) => {
    // Dërgo emrin tek serveri
    client.write(name);
  });
});

// Lexo të dhënat nga serveri
client.on('data', (data) => {
  console.log('Mesazh nga serveri:', data.toString());
  // Pas marrjes së mesazhit nga serveri, kërko komandën nga përdoruesi
  rl.question('Shkruani komandën tuaj: ', (command) => {
    sendCommand(command);
  });
});

// Trajto lidhjen e mbyllur
client.on('end', () => {
  console.log('Lidhja me serverin është mbyllur');
  rl.close();
});

// Trajto gabimet
client.on('error', (err) => {
  console.error('Gabim gjatë lidhjes:', err);
  rl.close();
});
