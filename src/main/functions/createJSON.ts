import path from 'path';

const fs = require('fs');

export function createFiles(
  userDirectory: string,
  pinnedPath: string,
  prioritiesPath: string,
  projectsPath: string,
  recentlyUsedPath: string,
  aepPath: string,
) {
  // Create necessary directories
  try {
    // Check if userDirectory/AEExplorer exists
    fs.statSync(path.join(userDirectory, '/aeexplorer'));
    console.log(userDirectory + ' already exists');
  } catch (error) {
    // Create userDirectory/AEExplorer
    try {
      fs.mkdirSync(path.join(userDirectory, '/aeexplorer'), {
        recursive: true,
      });

      console.log('Directory created successfully');
    } catch (error) {
      return console.error(
        'Error with creating userDirectory/AEExplorer',
        error,
      );
    }

    // Create userDirectory/AEExplorer/projects
    try {
      fs.mkdirSync(path.join(userDirectory, '/aeexplorer/projects'), {
        recursive: true,
      });
    } catch (error) {
      return console.error(
        'Error with creating userDirectory/aeexplorer/projects',
        error,
      );
    }

    // Create userDirectory/AEExplorer/json
    try {
      fs.mkdirSync(path.join(userDirectory, '/aeexplorer/json'), {
        recursive: true,
      });
    } catch (error) {
      return console.error(
        'Error with creating userDirectory/aeexplorer/json',
        error,
      );
    }
  }

  // Create necessary JSON files

  // create pinned-projects.json if it doesn't exist in the path
  fs.stat(pinnedPath, (err, stats) => {
    if (err) {
      fs.writeFile(pinnedPath, JSON.stringify({}), (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(pinnedPath + ' was created');
        }
      });
    } else {
      console.log(pinnedPath + ' Exists already');
    }
  });

  // create project-priorities.json if it doesn't exist
  fs.stat(prioritiesPath, (err, stats) => {
    if (err) {
      fs.writeFile(prioritiesPath, JSON.stringify({}), (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(prioritiesPath + ' was created');
        }
      });
    } else {
      console.log(prioritiesPath + ' Exists already');
    }
  });

  // create projects.json if it doesn't exist
  fs.stat(projectsPath, (err, stats) => {
    if (err) {
      fs.writeFile(projectsPath, JSON.stringify({}), (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(projectsPath + ' was created');
        }
      });
    } else {
      console.log(projectsPath + ' Exists already');
    }
  });

  // Create recently-used-projects.json if doesn't exist
  fs.stat(recentlyUsedPath, (err, stats) => {
    if (err) {
      fs.writeFile(recentlyUsedPath, JSON.stringify([]), (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(recentlyUsedPath + ' was created');
        }
      });
    } else {
      console.log(recentlyUsedPath + ' Exists already');
    }
  });

  fs.stat(aepPath, (err, stats) => {
    if (err) {
      fs.mkdir(aepPath, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(aepPath + ' folder was created');
        }
      });
    } else {
      console.log(aepPath + ' folder exists already');
    }
  });
}
