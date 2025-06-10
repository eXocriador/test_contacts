import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { toggleTheme } from '../store/slices/themeSlice';

function ThemeToggle() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  return (
    <Tooltip
      title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <IconButton color="inherit" onClick={() => dispatch(toggleTheme())}>
        {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  );
}

export default ThemeToggle;
