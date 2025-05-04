import GaleryObservation from '@/components/profile/GaleryObservation';
import UserProfileHeader from '@/components/profile/UserProfileHeader';
import { View } from 'react-native';

export default function Profile() {
  return (
    <View>
      <GaleryObservation header={<UserProfileHeader />} />
    </View>
  );
}
