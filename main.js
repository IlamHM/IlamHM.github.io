const { app, BrowserWindow } = require('electron');
const axios = require('axios');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Load the index.html file
  win.loadFile('index.html');

  // Open DevTools (remove this line in production)
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

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

// Call fetchData function whenever needed
fetchData();

// Quit when all windows are closed, except on macOS
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
