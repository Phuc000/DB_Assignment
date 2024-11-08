// src/Shipper.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import UserLayout from '../../Components/UserLayout/UserLayout';
import {
  LocalShipping as LocalShippingIcon,
  Assignment as AssignmentIcon,
  // ... other icons relevant to shippers
} from '@mui/icons-material';

const Shipper = () => {
  const [open, setOpen] = React.useState(true);

  // Menu items for the shipper sidebar
  const shipperMenuItems = [
    { text: 'Current Deliveries', icon: <LocalShippingIcon />, path: '/shipper/current-deliveries' },
    { text: 'Delivery History', icon: <AssignmentIcon />, path: '/shipper/delivery-history' },
    // ... other shipper menu items
  ];

  const shipperName = 'Shipper Name'; // Replace with dynamic name
  const shipperEmail = 'shipper@example.com'; // Replace with dynamic email

  return (
    <UserLayout
      menuItems={shipperMenuItems}
      userName={shipperName}
      userEmail={shipperEmail}
      userInitial={shipperName.charAt(0)}
      open={open}
      setOpen={setOpen}
    >
      <Outlet />
    </UserLayout>
  );
};

export default Shipper;