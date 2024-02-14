import { Box, makeStyles, Modal, Paper } from '@material-ui/core';
import { useState } from 'react';
import announcementModalStyles from './styles/anouncementModalStyles';
import formatAnnouncementError from './formatAnnouncementError';
import FormError from '../../Errors/FormError';
import Edit from './Edit';
import Create from './Create';
import Delete from './Delete';

const useStyles = makeStyles({
  mainModal: {
    display: 'flex',
    justifyContent: 'center',
  },
  announcementPanel: announcementModalStyles.announcementPanel,
});

const AnnouncementModal = ({
  showModal,
  toggleShowModal,
  mode,
  setMode,
  announcementId,
}) => {
  const classes = useStyles();
  const [isErrorSubmit, setErrorSubmit] = useState(false);
  const [errorData, setErrorData] = useState({});

  return (
    <Modal
      open={showModal}
      className={classes.mainModal}
      onClose={() => {
        setMode(null);
        toggleShowModal();
      }}
      elevation={0}
    >
      <Paper className={classes.announcementPanel} elevation={0}>
        <Box>
          {mode === 'edit' ? (
            <Edit
              setErrorSubmit={setErrorSubmit}
              setErrorData={setErrorData}
              announcementId={announcementId}
            />
          ) : null}

          {mode === 'create' ? (
            <Create
              setErrorSubmit={setErrorSubmit}
              setErrorData={setErrorData}
              toggleShowModal={toggleShowModal}
            />
          ) : null}

          {mode === 'delete' ? (
            <Delete
              setErrorSubmit={setErrorSubmit}
              setErrorData={setErrorData}
              toggleShowModal={toggleShowModal}
              announcementId={announcementId}
            />
          ) : null}
        </Box>

        {isErrorSubmit && (
          <FormError errorMessage={formatAnnouncementError(errorData)} />
        )}
      </Paper>
    </Modal>
  );
};

export default AnnouncementModal;
