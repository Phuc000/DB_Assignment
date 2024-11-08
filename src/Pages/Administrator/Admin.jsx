// src/Admin.jsx
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
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
  Avatar,
  Menu,
  MenuItem,
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
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';

const drawerWidth = 250;
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
  backgroundColor: '#303030', // Dark background for Drawer
  color: '#ffffff', // White text
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  backgroundColor: '#303030', // Dark background for Drawer
  color: '#ffffff', // White text
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
  minHeight: '64px', // Match AppBar height
  padding: theme.spacing(0, 1),
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

const DrawerStyled = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
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
}));

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create(['margin', 'width', 'margin-left'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  margin: '0 10px',
  width: `calc(100% - ${open ? drawerWidth : closedDrawerWidth}px)`,
}));

const Admin = () => {
  const muiTheme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);

  // State for profile menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Handle profile menu open
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle profile menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle menu item click
  const handleMenuItemClick = (option) => {
    handleMenuClose();
    if (option === 'logout') {
      // Implement logout functionality here
      navigate('/login'); // Redirect to login page after logout
    } else if (option === 'profile') {
      // Navigate to profile info page
      navigate('/admin/profile');
    }
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
  const adminEmail = 'admin@example.com'; // Replace with dynamic name if available

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
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Admin Panel
            </Typography>
            {/* Profile Box */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ marginRight: '8px' }}>
                {adminName}
              </Typography>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="account of current user"
                aria-controls={menuOpen ? 'profile-menu' : undefined}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
              >
                <AccountCircleIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBarStyled>

        {/* Profile Menu */}
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          keepMounted
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem disabled>
            <Typography variant="subtitle1">{adminName}</Typography>
          </MenuItem>
          <MenuItem disabled>
            <Typography variant="body2">{adminEmail}</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleMenuItemClick('profile')}>Profile Info</MenuItem>
          <MenuItem onClick={() => handleMenuItemClick('logout')}>Logout</MenuItem>
        </Menu>

        {/* Drawer (Sidebar) */}
        <DrawerStyled variant="permanent" open={open}>
          <DrawerHeader>
            {open && (
              <Typography variant="subtitle1" sx={{ paddingLeft: '16px', color: '#fff' }}>
                {adminName}
              </Typography>
            )}
            <IconButton onClick={handleDrawerToggle} sx={{ color: '#fff' }}>
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider sx={{ backgroundColor: '#484848' }} />
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
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#484848',
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#616161',
                      '&:hover': {
                        backgroundColor: '#757575',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                      color: '#fff',
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