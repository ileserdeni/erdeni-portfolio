import MobileLab from '../components/lab/MobileLab';
import Room from '../components/lab/Room';
import { useMediaQuery } from '../components/lab/useLab';
import { usePageTitle } from '../components/layout/ScrollManager';

export default function Home() {
  usePageTitle(null);
  const roomFits = useMediaQuery('(min-width: 1024px) and (min-height: 600px)');
  return roomFits ? <Room /> : <MobileLab />;
}
