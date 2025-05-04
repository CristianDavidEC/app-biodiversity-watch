import { Text, View } from 'react-native';
import UserProfileHeader from '@/components/profile/UserProfileHeader';
import GaleryObservation from '@/components/profile/GaleryObservation';

export default function Profile() {
  return (
    <View>
      <GaleryObservation header={<UserProfileHeader />} />
    </View>
  );
}
