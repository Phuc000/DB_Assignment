// src/Admin.jsx
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import { styled, useTheme, createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  LocalOffer as LocalOfferIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  ShoppingBag as ShoppingBagIcon,
} from '@mui/icons-material';

const drawerWidth = 240;
const closedDrawerWidth = 64;

// Custom theme with primary color #fe3bd4
const theme = createTheme({
  palette: {
    primary: {
      main: '#fe3bd4',
    },
  },
});

// Styled components for Drawer
const openedMixin = (theme) => ({
  width: drawerWidth,
  backgroundColor: '#fff',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  backgroundColor: '#fff',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `${closedDrawerWidth}px`,
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // Adjusted to align items in the center
  justifyContent: 'space-between',
}));

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  backgroundColor: theme.palette.primary.main,
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
  }),
  ...(!open && {
    width: `calc(100% - ${closedDrawerWidth}px)`,
    marginLeft: `${closedDrawerWidth}px`,
  }),
}));

const DrawerStyled = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: open ? drawerWidth : closedDrawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  })
);

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create(['margin', 'width', 'margin-left'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    margin: '0 10px',
    width: `calc(100% - ${open ? drawerWidth : closedDrawerWidth}px)`,
  })
);

const Admin = () => {
  const muiTheme = useTheme();
  const location = useLocation();
  const [open, setOpen] = React.useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Menu items for the admin sidebar
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Manage Products', icon: <ShoppingCartIcon />, path: '/admin/manage-products' },
    { text: 'Manage Inventory', icon: <InventoryIcon />, path: '/admin/manage-inventory' },
    { text: 'Manage Promotions', icon: <LocalOfferIcon />, path: '/admin/manage-promotions' },
    { text: 'View Orders', icon: <ShoppingBagIcon />, path: '/admin/view-orders' },
    { text: 'Manage Users', icon: <PeopleIcon />, path: '/admin/manage-users' },
  ];

  const adminName = 'Admin Name'; // Replace with dynamic name if available

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        {/* AppBar */}
        <AppBarStyled position="fixed" open={open}>
          <Toolbar>
            {/* Menu Icon for toggling drawer */}
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{
                marginRight: '16px',
              }}
            >
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Admin Panel
            </Typography>
          </Toolbar>
        </AppBarStyled>

        {/* Drawer (Sidebar) */}
        <DrawerStyled variant="permanent" open={open}>
          <DrawerHeader>
            {open && (
              <Typography variant="subtitle1" sx={{ paddingLeft: '16px' }}>
                {adminName}
              </Typography>
            )}
            <IconButton onClick={handleDrawerToggle}>
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <Tooltip title={open ? '' : item.text} placement="right" key={item.text}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    '&.Mui-selected': {
                      backgroundColor: muiTheme.palette.action.selected,
                      '&:hover': {
                        backgroundColor: muiTheme.palette.action.hover,
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Tooltip>
            ))}
          </List>
        </DrawerStyled>

        {/* Main Content */}
        <Main open={open}>
          <Toolbar />
          {/* This Outlet will render the matched child route */}
          <Outlet />
        </Main>
      </Box>
    </ThemeProvider>
  );
};

export default Admin;