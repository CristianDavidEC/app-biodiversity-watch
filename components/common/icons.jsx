import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';

export const HomeIcon = (props) => <FontAwesome name="home" size={24} color="white" {...props} />;

export const CameraIcon = (props) => (
  <FontAwesome name="camera" size={24} color="white" {...props} />
);

export const ProfileIcon = (props) => (
  <FontAwesome name="user" size={24} color="white" {...props} />
);

export const LocationIcon = (props) => (
  <FontAwesome6 name="map-location" size={24} color="white" {...props} />
);
