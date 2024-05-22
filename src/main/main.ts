//@ts-nocheck
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { exec } from 'child_process';

import {
  addPriorityDefault,
  changePriority,
  getPriorities,
} from './functions/priorities';

import { createFiles } from './functions/createJSON';

const fs = require('fs-extra');
const { dialog } = require('electron');

const home = process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];
let userDirectory: string;
// create settings directory and settings if it doesn't exist
let aepPath,
  pinnedPath,
  prioritiesPath,
  projectsPath,
  recentlyUsedPath,
  settingsPath,
  templatePath;

function setSettings() {
  return new Promise((resolve, reject) => {
    fs.stat(path.join(home, '/aeexplorer-settings'), (err, stats) => {
      if (err) {
        // create settings folder
        try {
          fs.mkdirSync(path.join(home, '/aeexplorer-settings'), {
            recursive: true,
          });

          fs.writeFileSync(
            path.join(home, '/aeexplorer-settings/settings.json'),
            JSON.stringify({ home }),
          );

          resolve();
        } catch (error) {
          console.error(error);
          reject(error);
        }

        // create settings.json
      } else {
        console.log(settingsPath + ' Exists already');
        resolve();
      }
    });
  });
}

function readSettings() {
  return new Promise((resolve, reject) => {
    try {
      let read = fs.readFileSync(
        path.join(home, '/aeexplorer-settings/settings.json'),
      );
      let json = JSON.parse(read);
      userDirectory = json['home'];
      resolve();
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
}

async function initializeApp() {
  try {
    await setSettings();
    await readSettings();

    aepPath = path.join(userDirectory, '/aeexplorer/projects');
    pinnedPath = path.join(
      userDirectory,
      '/aeexplorer/json/pinned-projects.json',
    );
    prioritiesPath = path.join(
      userDirectory,
      '/aeexplorer/json/project-priorities.json',
    );
    projectsPath = path.join(userDirectory, '/aeexplorer/json/projects.json');
    recentlyUsedPath = path.join(
      userDirectory,
      '/aeexplorer/json/recently-used-projects.json',
    );

    settingsPath = path.join(home, '/aeexplorer-settings/settings.json');

    templatePath = app.isPackaged
      ? path.join(process.resourcesPath, 'assets/template/template.aep')
      : path.join(__dirname, '../../assets/template/template.aep');

    // Creates necessary JSON files if they don't already exist in the directory.
    createFiles(
      userDirectory,
      pinnedPath,
      prioritiesPath,
      projectsPath,
      recentlyUsedPath,
      aepPath,
      settingsPath,
      home,
    );
  } catch (error) {
    console.error('Error during app initialization', error);
  }
}

initializeApp();

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('window-functions', async (event, args) => {
  console.log(args[0]);

  switch (args[0]) {
    case 'minimize':
      mainWindow.minimize();
      break;
    case 'maximize':
      mainWindow.maximize();
      break;
    case 'close':
      mainWindow.close();
      break;
  }
});

ipcMain.on('ctrl-click-project', async (event, args) => {
  console.log('args', args[0]);
  let path = aepPath + '\\' + args[0];
  require('child_process').exec(`start "" "${path}"`);
});
ipcMain.on('get-project-count', async (event, args) => {
  const files = fs.readdirSync(aepPath);

  event.reply('get-project-count', files.length);
});

function addClone(name) {
  console.log('add clone to projects list');

  try {
    let read = fs.readFileSync(projectsPath, 'utf-8');
    let json = JSON.parse(read);

    let statsObj = fs.statSync(aepPath + '\\' + name);
    let aep = fs.statSync(aepPath + '\\' + name + '\\' + name + '.aep');

    json[name.toString()] = {
      name: name,
      date: statsObj.birthtime,
      fileSize: aep.size / (1024 * 1024),
    };

    // write to json
    try {
      let newJSON = JSON.stringify(json);
      fs.writeFileSync(projectsPath, newJSON);
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
}

ipcMain.on('clone-project', async (event, args) => {
  let name = args[0];
  let indexFound = false;
  console.log('cloning project', name);

  // folder paths
  const originalPath = path.join(aepPath, name);
  const tempPath = path.join(aepPath, 'BCq6LDdKMZv05n5');

  try {
    await fs.copy(originalPath, tempPath);
    console.log('successfully moved folder');
  } catch (err) {
    console.log(err);
    event.reply('clone-project', { success: false, error: err.message });
    return;
  }

  // Figure out what index it needs to be
  let i = 1;
  while (!indexFound) {
    const indexedPath = path.join(aepPath, `${name}(${i})`);
    try {
      await fs.access(indexedPath);
      // If no error, it means the path exists, so increment the index and try again
      i++;
    } catch (err) {
      // If there's an error, it means the path does not exist, so we can use this index
      try {
        const tempFilePath = path.join(tempPath, `${name}.aep`);
        const tempFileNewPath = path.join(tempPath, `${name}(${i}).aep`);

        // Check if the temporary file exists before renaming it
        await fs.access(tempFilePath);

        // Rename File
        await fs.rename(tempFilePath, tempFileNewPath);
        console.log('File renamed');

        // Check if the temporary directory exists before renaming it
        await fs.access(tempPath);

        // Rename Folder
        await fs.rename(tempPath, indexedPath);
        console.log('Folder renamed');

        addRecentAEP(`${name}(${i}).aep`);
        addClone(`${name}(${i})`);
        event.reply('clone-project', [
          true,
          'Successfully copied ' + args[0] + ' to ' + `${name}(${i})`,
        ]);
        indexFound = true;
      } catch (error) {
        console.error('Error renaming file or folder: ', error);
        event.reply('clone-project', { success: false, error: error.message });
        return;
      }
    }
  }
});
ipcMain.on('recover-aep', async (event, args) => {
  let projectName = args[0];
  // Check if there's an autosave folder

  fs.stat(
    aepPath + '//' + projectName + '//' + 'Adobe After Effects Auto-Save',
    (err, stats) => {
      if (err) {
        console.log('No autosaves directive.');
        event.reply('recover-aep', [false, 'No auto-saves directive exists.']);
        return;
      }

      // Take most recent file and

      var files = fs.readdirSync(
        aepPath + '//' + projectName + '//' + 'Adobe After Effects Auto-Save',
      );

      for (var i = 0; i < files.length; i++) {
        if (path.extname(files[i]) != '.aep') {
          files.splice(i, 1);
        }
      }

      if (files[files.length - 1] != null) {
        console.log(files[files.length - 1]);
        const currentDate = new Date();
        const currentDayOfMonth = currentDate.getDate();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const dateString =
          currentDayOfMonth + '-' + (currentMonth + 1) + '-' + currentYear;

        // add the main file to archive
        fs.renameSync(
          // old path, new path
          aepPath + '//' + projectName + '//' + projectName + '.aep',
          aepPath +
            '//' +
            projectName +
            '//' +
            'Archive' +
            '//' +
            projectName +
            '(Archived) ' +
            dateString +
            '.aep',
        );

        // replace main file with autosave file

        fs.renameSync(
          // old path, new path
          aepPath +
            '//' +
            projectName +
            '//' +
            'Adobe After Effects Auto-Save' +
            '//' +
            files[files.length - 1],
          aepPath + '//' + projectName + '//' + projectName + '.aep',
        );

        // delete  autosave file

        console.log('file moved');
        event.reply('recover-aep', [
          true,
          'Reverted to ' + files[files.length - 1] + '.',
        ]);
      } else {
        console.log('ERROR: No further auto-saves to recover from.');
        event.reply('recover-aep', [false, 'No more auto-saves available.']);
      }
    },
  );
});

ipcMain.on('get-directory', async (event, args) => {
  try {
    let read = fs.readFileSync(settingsPath, 'utf-8');
    let json = JSON.parse(read);

    event.reply('get-directory', json['home']);
  } catch (error) {}
});

ipcMain.on('show-directory-select', async (event, args) => {
  dialog
    .showOpenDialog(mainWindow, {
      properties: ['openFile', 'openDirectory'],
    })
    .then((result) => {
      console.log(result.canceled);
      console.log(result.filePaths);

      // Set & Restart
      if (!result.canceled) {
        let read = fs.readFileSync(settingsPath, 'utf-8');
        let json = JSON.parse(read);
        json['home'] = result.filePaths[0];

        try {
          let newJSON = JSON.stringify(json);
          fs.writeFileSync(settingsPath, newJSON);

          app.relaunch();
          app.quit();
        } catch (error) {}
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// Get file path

ipcMain.on('rename-project', async (event, args) => {
  let oldName = args[0];
  let newName = args[1];

  if (newName == null || newName == '' || newName == ' ') {
    event.reply('rename-project', [false, 'File name cannot be blank!']);
    return;
  }
  var files = fs.readdirSync(aepPath);

  for (var i = 0; i < files.length; i++) {
    console.log(files[i]);
    if (newName == files[i]) {
      console.log('file already exists');
      event.reply('rename-project', [false, 'File name already exists!']);
      return;
    }
  }

  // Rename from pinned-projects.json
  try {
    let read = fs.readFileSync(pinnedPath, 'utf-8');
    let json = JSON.parse(read);

    json[newName] = json[oldName];
    delete json[oldName];
    try {
      let newJSON = JSON.stringify(json);
      fs.writeFileSync(pinnedPath, newJSON);
    } catch (error) {}
  } catch (error) {
    console.error(error);
  }

  // Rename from File
  try {
    fs.renameSync(aepPath + '\\' + oldName, aepPath + '\\' + newName);
    event.reply('rename-project', [
      true,
      'Renamed ' + oldName + ' to ' + newName + '.',
    ]);
  } catch (error) {
    console.error(error);
  }

  try {
    fs.renameSync(
      aepPath + '\\' + newName + '\\' + oldName + '.aep',
      aepPath + '\\' + newName + '\\' + newName + '.aep',
    );
  } catch (error) {
    console.error(error);
  }

  // Delete from projects.json
  try {
    let read = fs.readFileSync(projectsPath, 'utf-8');
    let json = JSON.parse(read);
    json[newName] = json[oldName];
    delete json[oldName];
    json[newName].name = newName;

    try {
      let newJSON = JSON.stringify(json);
      fs.writeFileSync(projectsPath, newJSON);
    } catch (error) {}
  } catch (error) {
    console.error(error);
  }

  // Delete from project-priorities.json

  try {
    let read = fs.readFileSync(prioritiesPath, 'utf-8');
    let json = JSON.parse(read);
    json[newName] = json[oldName];

    delete json[oldName];

    try {
      let newJSON = JSON.stringify(json);
      fs.writeFileSync(prioritiesPath, newJSON);
    } catch (error) {}
  } catch (error) {
    console.error(error);
  }

  // Delete from recently-used-projects.json

  // Read
  try {
    let jsonArray = [];
    const data = fs.readFileSync(recentlyUsedPath, 'utf-8');
    // Parse
    try {
      jsonArray = JSON.parse(data);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return;
    }

    // Delete
    for (var i = 0; i < jsonArray.length; i++) {
      if (jsonArray[i].name === args[0]) {
        jsonArray[i].name = args[1];
      }
    }

    // Write
    fs.writeFile(
      recentlyUsedPath,
      JSON.stringify(jsonArray),
      'utf-8',
      (err: any) => {
        if (err) {
          console.error('Error with writing file: ', err);
          return;
        }
      },
    );
  } catch (error) {}
});
ipcMain.on('get-pinned', async (event, args) => {
  try {
    let data = fs.readFileSync(pinnedPath, 'utf-8');

    try {
      data = JSON.parse(data);
    } catch (error) {}

    event.reply('get-pinned', data);
  } catch (error) {
    console.error('error with reading file, ', error);
  }
});
ipcMain.on('add-pinned', async (event, args) => {
  let name = args[0];
  console.log(name);

  try {
    fs.readFile(pinnedPath, 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      try {
        data = JSON.parse(data);
      } catch {
        data = {};
      }

      if (!data.hasOwnProperty(name)) {
        data[name] = {};
      } else {
        console.log(name + 'project is pinned already');
        delete data[name];
      }

      fs.writeFile(pinnedPath, JSON.stringify(data), (err) => {
        if (err) console.error('Error with writing properties file', error);
        else {
          console.log('Succesfully wrote ' + name + ' to pinned-projects.json');
          event.reply('add-pinned', 'success');
        }
      });
    });
  } catch (error) {
    console.error('error with reading file, ', error);
  }
});

ipcMain.on('get-recent-projects', async (event, args) => {
  // get file
  try {
    fs.readFile(recentlyUsedPath, 'utf-8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      let json;
      try {
        json = JSON.parse(data);
      } catch (error) {
        console.error(error);
      }

      console.log(json);
      event.reply('get-recent-projects', json);
    });
  } catch (error) {
    console.error(error);
  }
});
ipcMain.on('delete-project', async (event, args) => {
  console.log('delete project');

  // Delete from
  try {
    let read = fs.readFileSync(pinnedPath, 'utf-8');
    let json = JSON.parse(read);
    delete json[args[0]];

    try {
      let newJSON = JSON.stringify(json);
      fs.writeFileSync(pinnedPath, newJSON);
    } catch (error) {}
  } catch (error) {
    console.error(error);
  }

  // Delete from File
  try {
    fs.rmdirSync(aepPath + '\\' + args[0], {
      recursive: true,
      force: true,
    });
  } catch (error) {
    console.error(error);
  }

  // Delete from projects.json
  try {
    let read = fs.readFileSync(projectsPath, 'utf-8');
    let json = JSON.parse(read);
    delete json[args[0]];

    try {
      let newJSON = JSON.stringify(json);
      fs.writeFileSync(projectsPath, newJSON);
    } catch (error) {}
  } catch (error) {
    console.error(error);
  }

  // Delete from project-priorities.json
  //
  //
  try {
    let read = fs.readFileSync(prioritiesPath, 'utf-8');
    let json = JSON.parse(read);
    delete json[args[0]];

    try {
      let newJSON = JSON.stringify(json);
      fs.writeFileSync(prioritiesPath, newJSON);
    } catch (error) {}
  } catch (error) {
    console.error(error);
  }

  // Delete from recently-used-projects.json
  //
  //
  // Read
  try {
    let jsonArray = [];
    const data = fs.readFileSync(recentlyUsedPath, 'utf-8');
    // Parse
    try {
      jsonArray = JSON.parse(data);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return;
    }

    // Delete
    for (var i = 0; i < jsonArray.length; i++) {
      if (jsonArray[i].name === args[0]) {
        jsonArray.splice(i, 1);

        i = jsonArray.length;
      }
    }

    // Write
    fs.writeFile(
      recentlyUsedPath,
      JSON.stringify(jsonArray),
      'utf-8',
      (err: any) => {
        if (err) {
          console.error('Error with writing file: ', err);
          return;
        }
      },
    );
  } catch (error) {}

  event.reply('delete-project', [true, 'Successfully deleted ' + args[0]]);
});
ipcMain.on('set-priority', async (event, args) => {
  changePriority(args, prioritiesPath);
});

ipcMain.on('get-priorities', async (event) => {
  let json = getPriorities(prioritiesPath);
  event.reply('get-priorities', json);
});

// Returns projects.json to frontend
ipcMain.on('get-projects', async (event) => {
  try {
    let read = fs.readFileSync(projectsPath, 'utf-8');

    let json = JSON.parse(read);
    event.reply('get-projects', json);
  } catch (err) {
    console.log(err);
  }
});

// Updates the projects.json with names in the file directory
ipcMain.on('update-projects', async (event, arg) => {
  let jsonObj: { [key: string]: { name: String; date: any } } = {};
  // read from directory
  try {
    let fileList = fs.readdirSync(aepPath);

    fileList.forEach((obj: { name: String }) => {
      let statsObj = fs.statSync(aepPath + '\\' + obj);
      let aep = fs.statSync(aepPath + '\\' + obj + '\\' + obj + '.aep');
      jsonObj[obj.toString()] = {
        name: obj,
        date: statsObj.birthtime,
        fileSize: aep.size / (1024 * 1024),
      };

      // Add
    });

    // write to json
    try {
      let newJSON = JSON.stringify(jsonObj);
      fs.writeFileSync(projectsPath, newJSON);
    } catch (error) {}
  } catch (error) {
    console.log(error);
  }
});

ipcMain.on('open-aep', async (event, folderName) => {
  folderName = aepPath + '\\' + folderName + '\\' + folderName + '.aep';
  const command =
    process.platform === 'darwin'
      ? `open "${folderName}"`
      : process.platform === 'win32'
      ? `start /b "" "${folderName}"`
      : process.platform === 'linux'
      ? `xdg-open "${folderName}"`
      : null;

  if (command) {
    exec(command, (error) => {
      if (error) {
        console.error(`Error opening After Effects project: ${error}`);
      }
    });
  } else {
    console.error('Unsupported operating system');
  }
});

function addRecentAEP(fileName) {
  // Add to recently used/created

  // initialize array
  let jsonArray = [];

  // read json
  const data = fs.readFileSync(recentlyUsedPath, 'utf-8');

  // parse json
  try {
    jsonArray = JSON.parse(data);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    jsonArray = [];
  }

  // debug
  console.log('array length: ' + jsonArray.length);

  // loop array check for name

  var nameExists = false;
  const currentDate = new Date();

  const hour = currentDate.toLocaleString([], {
    hour: 'numeric',
    minute: 'numeric',
  });
  const month = currentDate.getUTCMonth() + 1;
  const day = currentDate.getUTCDate();
  const year = currentDate.getUTCFullYear();
  const newDate = `${hour} ${month}/${day}/${year}`;

  for (var i = 0; i < jsonArray.length; i++) {
    if (jsonArray[i].name === fileName) {
      console.log('nameExits = true');
      nameExists = true;
      jsonArray.splice(i, 1);
      jsonArray.push({ name: fileName, date: newDate });

      i = jsonArray.length; // exit loop
    }
  }

  if (!nameExists) {
    // remove LRU index
    if (jsonArray.length == 12) {
      jsonArray.splice(0, 1);
    }

    jsonArray.push({ name: fileName, date: newDate });
  }

  fs.writeFile(
    recentlyUsedPath,
    JSON.stringify(jsonArray),
    'utf-8',
    (err: any) => {
      if (err) {
        console.error('Error with writing file: ', err);
        return;
      }
    },
  );
}
ipcMain.on('add-recent-aep', async (event, fileName) => {
  addRecentAEP(fileName);
});
ipcMain.on('create-aep', async (event, fileName) => {
  fileName = fileName.replaceAll('/', '');
  fileName = fileName.replaceAll('\\', '');
  var newDirective = aepPath + '\\' + fileName;

  // Create new folder
  try {
    if (!fs.existsSync(newDirective)) {
      fs.mkdirSync(newDirective);
    } else {
      console.error('File already exists!');
    }
  } catch (err) {
    return;
  }

  // Make aep in the folder with the same name as the folder

  try {
    fs.copyFileSync(templatePath, newDirective + '\\' + fileName + '.aep');
  } catch (err) {
    console.log(err);
  }

  // Make archive folder
  try {
    fs.mkdirSync(newDirective + '\\' + 'Archive');
  } catch {
    console.log(err);
  }

  // Add to recently used/created

  addRecentAEP(fileName);
  addPriorityDefault(fileName, prioritiesPath);
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    minHeight: 720,
    minWidth: 1280,
    frame: false,

    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  mainWindow.setBackgroundColor('#0000');
  mainWindow.setMenuBarVisibility(false);

  mainWindow.loadURL(resolveHtmlPath('index.html'));
  mainWindow.maximize();

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
