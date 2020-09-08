import React, {useContext, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden'
import MenuIcon from '@material-ui/icons/Menu'

import {ReactComponent as Logo} from '../gitlytics-logo.svg'

import {Switch, Route, Redirect} from 'react-router-dom';

import Home from './Home';
import MiniProfile from './MiniProfile';
import Callback from './Callback'

import {UserContext} from '../UserContext';
import AuthList from './AuthList';
import Courses from './Courses/Courses';
import { LoadProvider } from '../LoadContext';
import { isLoggedIn } from '../api/auth';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    }
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      marginLeft: drawerWidth
    }
  },
}));



export default function Main() {
  const classes = useStyles();
  const {user, setUser} = useContext(UserContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleDrawer(){
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <React.Fragment>
      <MiniProfile />
      <Divider />
      <AuthList />
    </React.Fragment>
  )

  return (
    <React.Fragment>
      {isLoggedIn() ? (
        <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={toggleDrawer}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
            <Logo height="40" width="40" style={{fill: "white", paddingRight: '8px'}}/>
            <Typography variant="h6" noWrap>
              gitlytics
            </Typography>
          </Toolbar>
        </AppBar>
        <Hidden mdUp>
          <Drawer
              variant="temporary"
              anchor='left'
              open={mobileOpen}
              onClose={toggleDrawer}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <main className={classes.content}>
          <LoadProvider>
            <div className={classes.toolbar} />
            <Switch>
                {/* <Route exact path="/" component={Home} />
                <Route path="/callback" component={Callback} /> */}
                <Redirect exact from="/main" to="/main/courses" />
                <Route path="/main/courses" component={Courses} />
            </Switch>
          </LoadProvider>
        </main>
      </div>
      ) : (
        <Redirect to="/" />
      )}
      
    </React.Fragment>
  );
}
