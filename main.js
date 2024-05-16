const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const axios = require('axios'); // Import Axios for making HTTP requests

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    }
  });

  mainWindow.loadFile('index.html');

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Call fetchData() after the window is created
  fetchData();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Function to fetch data from the server using Axios
async function fetchData() {
  try {
    const response = await axios.get('https://ilam-hm-github-io.vercel.app/api/getData');
    const data = response.data;
    // Use data retrieved from the server (e.g., pass it to the renderer process)
    console.log(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
