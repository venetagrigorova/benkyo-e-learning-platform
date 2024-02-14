const formatUserConnectError = (errorData) => {
  switch (errorData.errorCode) {
    case 1:
      return 'Your email address is not linked to any account.';
    case 2:
      return 'This email address is already linked to an account.';
    case 5:
      return 'You might have forgotten your password ...';
    case 6:
      return errorData.data.errors.map((item) => item.msg).join('\n');
    default:
      return `Oops, something went wrong! Our fantastic team will fix that soon :)`;
  }
};

export default formatUserConnectError;
