import React from 'react';
import { Avatar } from '@mui/material';

const ROBOT_URL = "https://client-uploads.nyc3.digitaloceanspaces.com/images/731d7eb6-98fd-4f14-8af6-386d93ba0e57/2025-10-24T03-50-17-074Z-0b544258.jpg";

interface RobotAvatarProps {
  size?: number;
}

const RobotAvatar: React.FC<RobotAvatarProps> = ({ size = 100 }) => (
  <Avatar
    src={ROBOT_URL}
    sx={{
      width: size,
      height: size,
      border: '3px solid rgba(255,255,255,0.3)',
    }}
  />
);

export default RobotAvatar;