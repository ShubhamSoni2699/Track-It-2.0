import ButtonIcon from './ButtonIcon';
import { usePrivacyMode } from '../context/PrivacyModeContext';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

function PrivacyModeToggle() {
  const { isPrivacyMode, togglePrivacyMode } = usePrivacyMode();
  return (
    <ButtonIcon onClick={togglePrivacyMode}>
      {isPrivacyMode ? <HiOutlineEye /> : <HiOutlineEyeOff />}
    </ButtonIcon>
  );
}

export default PrivacyModeToggle;
