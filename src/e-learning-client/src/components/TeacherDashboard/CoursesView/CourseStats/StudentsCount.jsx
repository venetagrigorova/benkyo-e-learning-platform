/* eslint-disable react-hooks/exhaustive-deps */
import { Link, makeStyles, Modal, Typography } from '@material-ui/core';
import GroupIcon from '@material-ui/icons/Group';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { useContext, useEffect, useState } from 'react';
import TeacherContext from '../../../../context/TeacherContext';
import AlignedTextIcon from '../../../MicroComponents/AlignedTextIcon';
import EnrollModal from './EnrollModal';

const useStyles = makeStyles((theme) => ({
  enrollModal: {
    display: 'flex',
    justifyContent: 'center',
  },
  link: {
    cursor: 'pointer',
    fontSize: theme.typography.fontSize,
  },
}));

const StudentsCount = ({ courseId, coursePermissions, create, children }) => {
  const { teacherState, setTeacherState } = useContext(TeacherContext);
  const classes = useStyles();
  const [openEnrollModal, setOpenEnrollModal] = useState(false);

  useEffect(() => {
    setTeacherState({
      ...teacherState,
      handleCloseEnrollModal,
    });
  }, []);

  const handleOpenEnrollModal = () => {
    setOpenEnrollModal(true);
  };
  const handleCloseEnrollModal = () => {
    setOpenEnrollModal(false);
  };

  return (
    <>
      <AlignedTextIcon>
        {coursePermissions.length ? (
          <>
            <GroupIcon />
            <Typography>
              <Link onClick={handleOpenEnrollModal} className={classes.link}>
                {coursePermissions.length} student(s) enrolled
              </Link>
            </Typography>
          </>
        ) : (
          <>
            <RadioButtonUncheckedIcon />
            <Typography>
              <Link onClick={handleOpenEnrollModal} className={classes.link}>
                Click here to enroll students!
              </Link>
            </Typography>
          </>
        )}
      </AlignedTextIcon>

      <Modal
        open={openEnrollModal}
        className={classes.enrollModal}
        onClose={handleCloseEnrollModal}
        elevation={0}
        id={'enroll-modal-container-' + courseId}
      >
        {create ? (
          children
        ) : (
          <EnrollModal
            courseId={courseId}
            coursePermissions={coursePermissions}
          />
        )}
      </Modal>
    </>
  );
};

export default StudentsCount;
