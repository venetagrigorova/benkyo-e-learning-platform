import { CssBaseline } from '@material-ui/core';
import GlobalError from '../../components/Errors/GlobalError';

const ErrorView = () => {
  return (
    <CssBaseline>
      <div style={{ position: 'relative', height: '100vh' }}>
        <GlobalError />
      </div>
    </CssBaseline>
  );
};

export default ErrorView;
