import { createContext } from 'react';

const UserContext = createContext({
  userState: {
    userId: 0,
    email: "",
    firstName: "",
    lastName: "",
    birthdate: "",
    registrationDate: "",
    role: "",
  },
  setUserState: () => {}
});

export default UserContext;
