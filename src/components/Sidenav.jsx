import * as React from "react";
import { styled as muiStyled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import styled from "@emotion/styled";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MuiListItemButton from "@mui/material/ListItemButton";
import MuiListItemIcon from "@mui/material/ListItemIcon";
import MuiListItemText from "@mui/material/ListItemText";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const drawerWidth = 240;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  /** Custom Style */
  overflow: 'unset',
  backgroundColor: theme.palette.secondary.main,
  color: "white",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  svg: {
    color: "white",
  },
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  /** Custom Style */
  overflow: 'unset',
  backgroundColor: theme.palette.secondary.main,
  color: "white",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  svg: {
    color: "white",
  },
});

const DrawerHeader = muiStyled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  minHeight: "10px !important",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  "& button": {
    position: "absolute",
    height: "26px",
    width: "26px",
    top: "32px",
    right: "-13px"
  }
}));
const AppBar = muiStyled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer,
  backgroundColor: "#EFF3FC",
  paddingTop: '12px',
  color: "#192746",
  "& MuiTypography-root": {
    fontWeight: "bold",
  },
  boxShadow: "unset",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = muiStyled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

/** Custom styles */
const ListItemText = muiStyled(MuiListItemText)(({ theme }) => ({
  "& span": {
    fontSize: "0.9rem",
  },
}));
const ListItemIcon = muiStyled(MuiListItemIcon)(({ theme }) => ({
  "& svg": {
    fontSize: "1.1rem",
  },
}));
const ListItemButton = muiStyled(MuiListItemButton)(({ theme }) => ({
  "&.selected": {
    position: "relative",
    color: theme.palette.primary.main,
    "& svg": {
      color: theme.palette.primary.main,
    },
    "&::before": {
      position: "absolute",
      content: `""`,
      top: "50%",
      left: "0",
      transform: "translateY(-50%)",
      height: "25px",
      width: "3px",
      backgroundColor: theme.palette.primary.main,
    },
  },
}));
const CollapseButton = muiStyled(IconButton)(({ theme, open }) => ({
  backgroundColor: theme.palette.primary.main,
  transition: "background-color .3s ease-out",
  position: "absolute",
  height: "26px",
  width: "26px",
  top: "32px",
  right: "-13px",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
  },
  ...(!open && {
    margin: "0 auto",
  })
}));
const BoxContainer = muiStyled(Box)(({ theme, open }) => ({
  position: 'relative'
}));
const LogoImageContainer = muiStyled("div")(({ theme, open }) => ({
  margin: "0 auto",
  display: "flex",
  gap: "5px",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  "& span": {
    display: open ? "block" : "none",
    fontSize: "0.8rem",
  },
  "& img": {
    transition: "width .3s ease-out",
    width: open ? "100px" : "30px",
  },
}));
/** Custom styles */
export default function Sidenav({ children, items, logoSource, collapseLogoSource=null }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(window.innerWidth < 940 ? false : true);
  const [drawerCurrentWidth, setDrawerCurrentWidth] = React.useState(drawerWidth)
  const drawerRef = React.useRef();
  const location = useLocation();
  /** Keeps track of which submenu is open */
  const [submenus, setSubMenus] = React.useState();
  const [currentPage, setCurrentPage] = React.useState("");
  const { firstItems, secondItems } = items;
  const [selected, setSelected] = React.useState(location.pathname);
  const handleResize = () => {
    if (window.innerWidth < 940) {
        setOpen(false);
    } else {
        setOpen(true);
    }
  };
  React.useEffect(() => {
    setCurrentPage(firstItems[0]);
    let submenu_obj = {};
    if (firstItems) {
      firstItems.forEach((item) => {
        if (item.subItems) {
          if ("subItems" in item) {
            // Checkes if the submenu is a selected url
            const isSubmenuSelected = item.subItems.find(
              (sub) => sub.url === location.pathname
            );
            // If any submenu selected, keep it open
            submenu_obj[item.name] = isSubmenuSelected ? true : false;
          }
        }
      });
    }
    if (secondItems) {
      secondItems.forEach((item) => {
        if (item.subItems) {
          // Checkes if the submenu is a selected url
          const isSubmenuSelected = item.subItems.find(
            (sub) => sub.url === location.pathname
          );
          // If any submenu selected, keep it open
          if ("subItems" in item) {
            submenu_obj[item.name] = isSubmenuSelected ? true : false;
          }
        }
      });
    }
    setSubMenus(submenu_obj);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  React.useEffect(() => {
    if (submenus) {
      let obj = {};
      Object.keys(submenus).forEach((key) => {
        obj[key] = false;
      });
      setSubMenus(obj);
    }
  }, [open]);
  const handleCurrentPage = (page) => {
    setCurrentPage(page);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // const handleOpenSubmenu = (submenu) => {
  //   setOpen(true);
  //   setSubMenus({
  //     ...submenus,
  //     [submenu]: !submenus[submenu],
  //   });
  // };
  const handleOpenSubmenu = (submenu) => {
    setOpen(true);
    const newSubmenus = {}
    // Open the selected submenu item, collapse the rest
    Object.keys(submenus).forEach(menuKey => {
      newSubmenus[menuKey] = (menuKey === submenu) ? !submenus[menuKey] : false
    })
    setSubMenus(newSubmenus)
  };

  React.useEffect(() => {
    if (drawerRef.current) {
      setTimeout(() => {
        setDrawerCurrentWidth(drawerRef.current.offsetWidth)
      }, [200])
    }
  }, [open])

  return submenus ? (
    <NavWrapper theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {/* Individual Page Top Heading */}
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                opacity: 0,
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {currentPage.headingLabel ?? (currentPage.label ?? currentPage.name)}
            </Typography>
          </Toolbar>
        </AppBar>        
          
        <Drawer variant="permanent" open={open} ref={drawerRef}>
            <CollapseButton
              onClick={() => setOpen(!open)}
              size="small"
              open={open}
            >
              {theme.direction === "rtl" ? (
                open ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )
              ) : open ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </CollapseButton>
          {/* <DrawerHeader style={{ minHeight: '0px !important', height: "0px !important"}}>
            <CollapseButton
              onClick={() => setOpen(!open)}
              size="small"
              open={open}
            >
              {theme.direction === "rtl" ? (
                open ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )
              ) : open ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </CollapseButton>
          </DrawerHeader> */}
          <DrawerContent theme={theme}>
            {logoSource && (
              <LogoImageContainer open={open}>
                {
                  !collapseLogoSource ? 
                    <img src={logoSource} alt="Company Logo" /> :
                    <img src={open ? logoSource : collapseLogoSource} alt="Company Logo" />
                }
              </LogoImageContainer>
            )}
            {firstItems && (
              <List>
                {firstItems.map((item) =>
                  "subItems" in item ? (
                    <NestedListItem key={item.name} theme={theme}>
                      <ListItemButton
                        onClick={() => handleOpenSubmenu(item.name)}
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                        }}
                      >
                        {open && (
                          <div className="caretDown">
                            <KeyboardArrowDownIcon />
                          </div>
                        )}
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                            svg: {
                              color: item.color
                                ? `${item.color} !important`
                                : "auto",
                            },
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label ? item.label : item.name}
                          sx={{ opacity: open ? 1 : 0 }}
                          style={{ color: item.color ? item.color : "auto" }}
                        />
                      </ListItemButton>
                      <ul
                        style={{ maxHeight: `${item.subItems.length * 30}px` }}
                        className={submenus[item.name] && open ? "" : "collapsed"}
                      >
                        {item.subItems.map((subitem) => (
                          <li
                            key={subitem.name}
                            className={
                              location.pathname === subitem.url ? "selected" : ""
                            }
                          >
                            <Link
                              to={subitem.url ? subitem.url : "/"}
                              onClick={() => handleCurrentPage(subitem)}
                            >
                              {subitem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </NestedListItem>
                  ) : (
                    <Link
                      to={item.url ? item.url : "/"}
                      key={item.name}
                      onClick={() => handleCurrentPage(item)}
                    >
                      <ListItemButton
                        className={
                          location.pathname === item.url ? "selected" : ""
                        }
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                            svg: {
                              color: item.color
                                ? `${item.color} !important`
                                : "auto",
                            },
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label ? item.label : item.name}
                          sx={{ opacity: open ? 1 : 0 }}
                          style={{ color: item.color ? item.color : "auto" }}
                        />
                      </ListItemButton>
                    </Link>
                  )
                )}
              </List>
            )}
            <Divider />
            {secondItems && (
              <List>
                {secondItems.map((item) =>
                  "subItems" in item ? (
                    <NestedListItem theme={theme}>
                      <ListItemButton
                        onClick={() => handleOpenSubmenu(item.name)}
                        key="Projects"
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                        }}
                      >
                        {open && (
                          <div className="caretDown">
                            <KeyboardArrowDownIcon />
                          </div>
                        )}
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                            svg: {
                              color: item.color
                                ? `${item.color} !important`
                                : "auto",
                            },
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary="Dashboard"
                          sx={{ opacity: open ? 1 : 0 }}
                          style={{ color: item.color ? item.color : "auto" }}
                        />
                      </ListItemButton>
                      <ul
                        style={{ maxHeight: `${item.subItems.length * 30}px` }}
                        className={submenus[item.name] && open ? "" : "collapsed"}
                      >
                        {item.subItems.map((subitem) => (
                          <li key={subitem.name}>
                            <Link
                              to={subitem.url ? subitem.url : "/"}
                              onClick={() => handleCurrentPage(subitem)}
                            >
                              {subitem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </NestedListItem>
                  ) : (
                    <Link
                      to={item.url ? item.url : "/"}
                      onClick={() => handleCurrentPage(item)}
                    >
                      <ListItemButton
                        key={item.name}
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                            svg: {
                              color: item.color
                                ? `${item.color} !important`
                                : "auto",
                            },
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.label ? item.label : item.name}
                          sx={{ opacity: open ? 1 : 0 }}
                          style={{ color: item.color ? item.color : "auto" }}
                        />
                      </ListItemButton>
                    </Link>
                  )
                )}
              </List>
            )}
          </DrawerContent>
        </Drawer>
        
        <Container drawerWidth={drawerCurrentWidth}>
          <DrawerHeader />
          <div className="drawer-content">
            {children}
          </div>
          
        </Container>
      </Box>
    </NavWrapper>
  ) : (
    <div>Loading</div>
  );
}
const NavWrapper = styled.div`
  a {
    text-decoration: none;
    color: unset;
  }
`;
const DrawerContent = styled.div`
  margin-top: 15px;
  width: 100%;
  overflow-x: hidden;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`
const Container = styled.div`
  position: relative;
  text-align: unset;
  padding: 25px;  
  width: calc(100vw - (${props => props.drawerWidth}px + 30px));
  transition: width .3s ease-out;
  &::-webkit-scrollbar {
    background-color: #EFF3FC;
  }
  .drawer-content {
    padding: 15px;
    border-radius: 15px;
  }
`;

const NestedListItem = styled.div`
  position: relative;
  & > div {
    .caretDown {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-40%);
    }
  }
  @keyframes expand {
    from {
      max-height: 0px;
    }
    to {
      max-height: 300px;
    }
  }
  ul {
    margin-left: 10px;
    font-size: 0.7rem !important;
    list-style-type: none;
    // max-height: 300px;
    /* animation-name: identifier;
    animation-duration: 0.5s;
    animation-timing-function: expand; */
    transition: max-height 0.3s ease-out;
    overflow: hidden;
    &.collapsed {
      max-height: 0px !important;
    }
    li {
      position: relative;
      display: flex;
      gap: 15px;
      font-size: 0.8rem;
      height: 30px;
      &.selected {
        pointer-events: none;
        font-weight: bold;
        color: ${ props => props.theme.palette.primary.main};
        svg {
          color: ${ props => props.theme.palette.primary.main};;
        }
        &::before {
          background-color: ${ props => props.theme.palette.primary.main};;
        }
        &::after {
          background-color: ${ props => props.theme.palette.primary.main};;
        }
      }
      &::before {
        content: "";
        display: block;
        width: 2px;
        background-color: white;
      }
      &::after {
        content: "";
        display: block;
        position: absolute;
        top: 50%;
        transform: translate(-35%, -50%);
        background-color: white;
        height: 7px;
        width: 7px;
        border-radius: 50%;
      }
      &:hover::before {
        background-color: ${ props => props.theme.palette.primary.main};;
      }
      &:hover::after {
        background-color: ${ props => props.theme.palette.primary.main};;
      }
      &:hover a {
        color: ${ props => props.theme.palette.primary.main};;
      }
      a {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        text-decoration: none;
        color: "white";
        align-self: center;
      }
    }
  }
`;
const ListConnector = styled.div`
  height: 100%;
  width: 2px;
  background-color: #d1d1d1;
`;