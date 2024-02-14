import { createContext } from 'react';

const AuthContext = createContext({
  accountState: {},
  setAccountState: () => {},
});

export default AuthContext;
