//@ts-nocheck
import React from 'react';
import './Projects.css';
import '../../Components/Notification/Notification.css';
import './DropDownMenu.css';
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import AEP1 from '/assets/aepversions/aep-icon-default.svg';
import AEP2 from '/assets/aepversions/aep-icon-green.svg';
import AEP3 from '/assets/aepversions/aep-icon-red.svg';
import AEP4 from '/assets/aepversions/aep-icon-gold.svg';
import AEP5 from '/assets/aepversions/aep-icon-block.svg';
import AEP6 from '/assets/aepversions/aep-icon-check.svg';
import { Link } from 'react-router-dom';
import searchIcon from '/assets/search.svg';
import { randomEmoji } from './functions/randomEmoji';
import { sortArray } from './functions/sortProjects';
import ContextMenu from '../../Components/ContextMenu/ContextMenu';
import SortBox from '../../Components/SortBox/SortBox';
import DeleteProject from '../../Components/DeleteProject/DeleteProject';
import RenameProject from '../../Components/RenameProject/RenameProject';
import RecoverProject from '../../Components/RecoverProject/RecoverProject';
import Notification from '../../Components/Notification/Notification';
import { motion, useInView } from 'framer-motion';

const Projects = (props: Props) => {
  const [fix, setFix] = useState(false);
  const [projects, setProjects] = useState<string[]>([]);
  const [isSearch, setSearch] = useState(false);
  const [dictionary, setDictionary] = useState([]);
  const [searchItem, setSearchItem] = useState('');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [sort, setSort] = useState(0);
  const [sortValue, setSortValue] = useState(0);
  const [visibility, setVisibility] = useState(false);
  const [jsonArray, setArray] = useState([]);
  const [context, setContext] = React.useState(false);
  const [xyPosition, setxyPosition] = React.useState({ x: 0, y: 0 });
  const [selectedProject, setSelected] = useState('');
  const [priorities, setPriorities] = useState({});
  const [refreshProject, setRefresh] = useState(true);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [renameModalVisibility, setRenameVisibility] = useState(false);
  const [recoverModalVisibility, setRecoverVisibility] = useState(false);
  const [deleteRefresh, setDeleteRefresh] = useState(true);
  const [pinnedProjects, setPinned] = useState([]);
  const [showPin, setPinVisibility] = useState(false);
  const [nameChanged, setNameChanged] = useState(false);

  const [notificationText, setNotificationText] = useState('');
  const [notificationVisibility, setNotificationVisibility] = useState(false);

  const [responseCode, setResponseCode] = useState(false);
  const [projectsLength, setProjectsLength] = useState(0);

  function SectionView({ children }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
      <section ref={ref}>
        <span
          style={{
            opacity: isInView ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.17, 0.55, 0.55, 1) 0s',
          }}
        >
          {children}
        </span>
      </section>
    );
  }

  function pinProject(name) {
    window.electron.ipcRenderer.sendMessage('add-pinned', [name]);
    window.electron.ipcRenderer.once('add-pinned', (response) => {
      setRefresh(!refreshProject);
    });
  }

  function cloneProject(name) {
    window.electron.ipcRenderer.sendMessage('clone-project', [name]);
    window.electron.ipcRenderer.once('clone-project', (response) => {
      setNotificationText(response[1]);
      setResponseCode(response[0]);
      setNotificationVisibility(true);

      setRefresh(!refreshProject);
    });
  }

  function changePriority(name: String, priority: number) {
    window.electron.ipcRenderer.sendMessage('set-priority', [name, priority]);
  }

  function windowClick() {
    setContext(false);
  }

  const handleInputChange = (e: { target: { value: any } }) => {
    const searchTerm = e.target.value;
    if (searchTerm == '') {
      setSearch(false);
    } else {
      setSearch(true);
    }

    setSearchItem(searchTerm);

    const filteredItems = projects.filter((project) =>
      project.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setFilteredProjects(filteredItems);
  };

  function getPriorities() {
    window.electron.ipcRenderer.sendMessage('get-priorities');
    window.electron.ipcRenderer.once('get-priorities', (response) => {
      setPriorities(response);
    });
  }
  // Gets projects.json
  function getProjects() {
    window.electron.ipcRenderer.sendMessage('get-projects', ['changes']);
    window.electron.ipcRenderer.once('get-projects', (response) => {
      setArray(Object.values(response));
      console.log(response);
    });
  }

  // Organize projects into dates
  function set() {
    sortArray(jsonArray, sortValue);

    const names = jsonArray.map((obj) => obj.name);

    const organizedProjects = {};
    jsonArray.forEach((obj) => {
      let date = new Date(obj.date);

      var monthYearKey = `${randomEmoji(
        date.getMonth(),
      )}  ${date.toLocaleString('default', {
        month: 'long',
      })} - ${date.getFullYear()}`;
      if (!organizedProjects[monthYearKey]) {
        organizedProjects[monthYearKey] = [];
      }

      organizedProjects[monthYearKey].push(obj);
    });

    setDictionary(organizedProjects);

    setProjects(names);
    setFilteredProjects(names);
  }

  function handleOpen(e, project: string) {
    console.log(project);
    if (e.ctrlKey) {
      window.electron.ipcRenderer.sendMessage('ctrl-click-project', [project]);
      setResponseCode(true);
      setNotificationText('Opening ' + project + '.aep in the File Explorer');
      setNotificationVisibility(true);
    } else {
      window.electron.ipcRenderer.sendMessage('open-aep', project);
      window.electron.ipcRenderer.sendMessage('add-recent-aep', project);
      setResponseCode(true);
      setNotificationText('Opening ' + project + '.aep in After Effects...');
      setNotificationVisibility(true);
    }
  }

  function showNav(event, project: string) {
    setSelected(project);
    event.preventDefault();
    setContext(false);
    let positionChange;
    if (window.innerHeight / 2 + 145 < event.pageY - window.scrollY) {
      positionChange = {
        x: event.pageX - window.scrollX + 1,
        y: event.pageY - window.scrollY + -205,
      };
    } else {
      positionChange = {
        x: event.pageX - window.scrollX + 1,
        y: event.pageY - window.scrollY + -1,
      };
    }

    setxyPosition(positionChange);
    setContext(true);
  }

  //event handler for hiding the context menu
  const hideContext = (event) => {
    setContext(false);
  };
  const aepSVG = (name) => {
    let namePriority;

    try {
      namePriority = priorities[name].priority;
    } catch (error) {
      namePriority = 0;
    }

    switch (namePriority) {
      case 0:
        return <img className="aep-img" src={AEP1} />;
      case 1:
        return <img className="aep-img" src={AEP2} />;
      case 2:
        return <img className="aep-img" src={AEP3} />;
      case 3:
        return <img className="aep-img" src={AEP4} />;
      case 4:
        return <img className="aep-img" src={AEP5} />;
      case 5:
        return <img className="aep-img" src={AEP6} />;
      default:
        return <img className="aep-img" src={AEP1} />;
        break;
    }
  };

  const defaultList = () => {
    return (
      <ul className="projects-list">
        {filteredProjects.map((project, index) => (
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="box"
            whileHover={{ scale: [null, 1.1, null] }}
            transition={{
              type: 'just',

              duration: 0.1,
            }}
          >
            <li
              id="project-list"
              onClick={(e) => handleOpen(e, project)}
              key={index}
              className="project-item"
              onContextMenu={(e) => showNav(e, project)}
            >
              <div className="aep-img">{aepSVG(project)}</div>
              {project + '.aep'}
            </li>
          </motion.div>
        ))}
      </ul>
    );
  };

  const sortedByDate = useMemo(() => {
    return (
      <div className="projects">
        {Object.keys(dictionary).map((date) => (
          <div key={date}>
            <h3 id="date-title">{date}</h3>

            <hr className="solid"></hr>
            <ul className="projects-list" id="list-select">
              {dictionary[date].map((project, index) => (
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="box"
                  whileHover={{ scale: [null, 1.1, null] }}
                  transition={{
                    type: 'just',

                    duration: 0.1,
                  }}
                >
                  <li
                    id="project-list"
                    onClick={(e) => handleOpen(e, project.name)}
                    key={index}
                    className="project-item"
                    onContextMenu={(e) => showNav(e, project.name)}
                  >
                    {aepSVG(project.name)}
                    <span className="project-name">
                      {project.name + '.aep'}
                    </span>
                  </li>
                </motion.div>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }, [dictionary]);

  function handleSortClick() {
    setVisibility(!visibility);

    if (visibility == false) {
      setTimeout(() => {
        window.addEventListener(
          'click',
          function () {
            setVisibility(false);
          },
          { once: true },
        );
      }, '1');
    }
  }

  function getPinned() {
    window.electron.ipcRenderer.sendMessage('get-pinned');
    window.electron.ipcRenderer.once('get-pinned', (response) => {
      const temp = Object.keys(response);

      setPinned(temp);
    });
  }

  useEffect(() => {
    if (pinnedProjects.length > 0) {
      setPinVisibility(true);
    } else {
      setPinVisibility(false);
    }
  }, [pinnedProjects]);

  function displayPinned() {
    return (
      <>
        <div className="projects">
          <ul className="projects-list">
            {pinnedProjects.map((name, index) => (
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="box"
                whileHover={{ scale: [null, 1.1, null] }}
                transition={{
                  type: 'just',

                  duration: 0.1,
                }}
              >
                <li
                  id="project-list-pinned"
                  onClick={(e) => handleOpen(e, name)}
                  key={index}
                  className="project-item-pinned"
                  onContextMenu={(e) => showNav(e, name)}
                >
                  {aepSVG(name)}
                  {name + '.aep'}
                </li>
              </motion.div>
            ))}
          </ul>
        </div>
      </>
    );
  }
  function pinnedContent() {
    return (
      <>
        <h3 id="date-title">📌 Pinned</h3>
        <hr className="solid"></hr>

        <div className="pinned-projects-content">{displayPinned()}</div>
      </>
    );
  }
  useEffect(() => {
    const scrollElement = document.querySelector('#projects-content');
    const setFixed = () => {
      console.log(scrollElement.scrollTop);
      if (scrollElement.scrollTop >= 1) {
        setContext(false);
      }
      if (scrollElement.scrollTop >= 400) {
        setFix(true);
      } else {
        setFix(false);
      }
    };

    scrollElement.addEventListener('scroll', setFixed);
    window.addEventListener('click', windowClick);

    return () => {
      scrollElement.removeEventListener('scroll', setFixed);
      window.removeEventListener('click', windowClick);
    };
  }, []);

  useEffect(() => {
    console.log('refreshed');
    getPinned();
    getPriorities();
    getProjects();
  }, [refreshProject]);

  useEffect(() => {
    if (jsonArray.length >= 0) {
      set();
    }
  }, [jsonArray, sortValue]);

  useEffect(() => {
    console.log(pinnedProjects.length);
    if (searchItem != '') {
      console.log('false');
      setPinVisibility(false);
    } else if (searchItem == '' && pinnedProjects.length > 0) {
      console.log('true');
      setPinVisibility(true);
    }
  }, [searchItem]);

  useEffect(() => {
    if (notificationVisibility == true) {
      setTimeout(() => {
        setNotificationVisibility(false);
      }, 1800);
    }
  }, [notificationVisibility]);

  return (
    <div>
      <div className="container" id="projects-content">
        {modalVisibility && (
          <DeleteProject
            setModalVisibility={setModalVisibility}
            selectedProject={selectedProject}
            refreshProject={refreshProject}
            setRefresh={setRefresh}
            setContext={setContext}
            setNotificationText={setNotificationText}
            setNotificationVisibility={setNotificationVisibility}
            setResponseCode={setResponseCode}
          />
        )}

        {renameModalVisibility && (
          <RenameProject
            selectedProject={selectedProject}
            refreshProject={refreshProject}
            setRefresh={setRefresh}
            setContext={setContext}
            setRenameVisibility={setRenameVisibility}
            setNameChanged={setNameChanged}
            nameChanged={nameChanged}
            setNotificationText={setNotificationText}
            setNotificationVisibility={setNotificationVisibility}
            setResponseCode={setResponseCode}
          />
        )}

        {recoverModalVisibility && (
          <RecoverProject
            selectedProject={selectedProject}
            refreshProject={refreshProject}
            setRefresh={setRefresh}
            setContext={setContext}
            setRecoverVisibility={setRecoverVisibility}
            setNotificationText={setNotificationText}
            setNotificationVisibility={setNotificationVisibility}
            setResponseCode={setResponseCode}
          />
        )}

        {notificationVisibility && (
          <Notification
            notificationText={notificationText}
            responseCode={responseCode}
          />
        )}

        <ContextMenu
          showNav={showNav}
          hideContext={hideContext}
          context={context}
          xyPosition={xyPosition}
          selectedProject={selectedProject}
          changePriority={changePriority}
          setContext={setContext}
          setModalVisibility={setModalVisibility}
          setSelected={setSelected}
          pinProject={pinProject}
          setRenameVisibility={setRenameVisibility}
          setRecoverVisibility={setRecoverVisibility}
          cloneProject={cloneProject}
          refreshProject={refreshProject}
          setRefresh={setRefresh}
        />

        <span className="container-background">
          <div className="title-block">
            <div className="title-text">Projects</div>
            <Link to={'/CreateAEP'}>
              <button className="button-add">+</button>
            </Link>
          </div>

          <div id="search-line">
            <div id="search-container">
              <div
                id="search-box"
                className={fix ? 'search-box-fixed' : 'search-box'}
              >
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search..."
                  value={searchItem}
                  onChange={handleInputChange}
                  autoFocus
                />
                <img id="search-icon" src={searchIcon} alt="Search Icon" />
              </div>
            </div>

            <SortBox
              handleSortClick={handleSortClick}
              visibility={visibility}
              setSortValue={setSortValue}
            />
          </div>

          <div className="pinned-content">
            {showPin ? pinnedContent() : null}
          </div>
          <div className="content">
            {isSearch ? defaultList() : sortedByDate}
          </div>
        </span>
      </div>
    </div>
  );
};

export default Projects;
