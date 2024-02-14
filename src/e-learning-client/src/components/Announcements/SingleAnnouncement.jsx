import React, { useContext, useState } from 'react';
import { makeStyles, withStyles, Typography, Box } from '@material-ui/core';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import mainTheme from '../../themes/main.theme';
import mainThemeEnum from '../../themes/main.theme.enum';
import moment from 'moment';
import AlignedTextIcon from '../MicroComponents/AlignedTextIcon';
import EventIcon from '@material-ui/icons/Event';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import DeleteIcon from '@material-ui/icons/Delete';
import AuthContext from '../../context/AuthContext';
import AnnouncementModal from './AnnouncementModal/AnnouncementModal';
import FlexContainer from '../MicroComponents/FlexContainer';

const Accordion = withStyles({
  root: {
    border: mainThemeEnum.border.medium,
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {
    width: '100%',
  },
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: mainTheme.palette.background.paper,
    marginBottom: 0,
    minHeight: 50,
    '&$expanded': {
      minHeight: 30,
    },
    width: '100%',
    display: 'flex',
    justifyContent: 'space-apart',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  content: {
    '&$expanded': {
      marginBottom: 0,
    },
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  expanded: {},
})(MuiAccordionSummary);
const AccordionDetails = withStyles((theme) => ({
  root: {
    backgroundColor: mainTheme.palette.background.paper,
  },
}))(MuiAccordionDetails);

const useStyles = makeStyles({
  announcementActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  announcementTitle: {
    width: '100%',
    fontSize: '0.95rem',
  },
  announcementDetails: {
    textAlign: 'justify',
    display: 'block',
    flexWrap: 'wrap',
  },
});

const SingleAnnouncement = ({ announcement, showState, close }) => {
  const classes = useStyles();
  const { accountState } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const toggleShowModal = () => setShowModal(!showModal);
  const [mode, setMode] = useState(null);
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Accordion
      square
      expanded={expanded === 'panel1'}
      onChange={handleChange('panel1')}
    >
      <AccordionSummary aria-controls='panel1d-content' id='panel1d-header'>
        <Typography className={classes.announcementTitle} variant={'h6'}>
          {announcement?.announcementTitle}
        </Typography>
        <Box>
          <AlignedTextIcon>
            <EventIcon />
            <Typography variant={'body2'}>
              {moment(announcement?.announcementUploadDate).format(
                'MMMM Do YYYY, HH:mm'
              )}
            </Typography>
          </AlignedTextIcon>
        </Box>
      </AccordionSummary>

      <AccordionDetails className={classes.announcementDetails}>
        <Box className={classes.announcementActions}>
          {accountState.role === 'teacher' ? (
            <>
              <AlignedTextIcon>
                <BorderColorIcon
                  onClick={() => {
                    setMode('edit');
                    toggleShowModal();
                  }}
                />
              </AlignedTextIcon>
            </>
          ) : null}
          {accountState.role === 'teacher' ? (
            <>
              <AlignedTextIcon>
                <DeleteIcon
                  onClick={() => {
                    setMode('delete');
                    toggleShowModal();
                  }}
                />
              </AlignedTextIcon>
            </>
          ) : null}
        </Box>
        <Typography variant={'body2'}>
          {announcement?.announcementContent}
        </Typography>
      </AccordionDetails>

      <AnnouncementModal
        showModal={showModal}
        toggleShowModal={toggleShowModal}
        mode={mode}
        setMode={setMode}
        announcementId={announcement.announcementId}
      ></AnnouncementModal>
    </Accordion>
  );
};

export default SingleAnnouncement;
