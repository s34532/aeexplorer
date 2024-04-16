const fs = require('fs');

export function createFiles(
  pinnedPath: string,
  prioritiesPath: string,
  projectsPath: string,
  recentlyUsedPath: string,
  aepPath: string,
) {
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
