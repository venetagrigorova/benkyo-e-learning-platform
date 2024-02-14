import jwtDecode from 'jwt-decode';

const decodeToken = (token) => {
  try {
    const decodedToken = jwtDecode(token);

    if (token.exp < new Date().getTime()) {
      throw new Error();
    }

    return decodedToken;
  } catch {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    return {};
  }
};

const getToken = () => {
  const token =
    localStorage.getItem('token') || sessionStorage.getItem('token');

  return token;
};

const removeToken = () => {
  localStorage.removeItem('token');
};

export const getDecodedToken = () => decodeToken(getToken());
export { getToken, removeToken };
