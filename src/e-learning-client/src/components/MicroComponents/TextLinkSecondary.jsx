import { Link, Typography } from '@material-ui/core';

const TextLinkSecondary = ({ children, onClick = () => {} }) => {
  return (
    <Typography color='textSecondary'>
      <Link
        color='textSecondary'
        style={{ cursor: 'pointer' }}
        onClick={onClick}
      >
        {children}
      </Link>
    </Typography>
  );
};

export default TextLinkSecondary;
