import { makeStyles } from "@material-ui/core/styles";
import { 
  Box,
  Typography,
  Fab,
  Container
} from "@material-ui/core";
import AccountCircleSharpIcon from '@material-ui/icons/AccountCircleSharp';
import EmailIcon from '@material-ui/icons/Email';
import { useContext, useState } from "react";
import CourseContext from "../../context/CourseContext";
import Announcements from "../Announcements/Announcements";
import AlignedTextIcon from "../MicroComponents/AlignedTextIcon";
import AnnouncementIcon from '@material-ui/icons/Announcement';
import AddIcon from '@material-ui/icons/Add';
import ProgressBar from "../ProgressBar/ProgressBar";
import mainTheme from "../../themes/main.theme";
import mainThemeEnum from "../../themes/main.theme.enum";
import AuthContext from "../../context/AuthContext";
import AnnouncementModal from "../Announcements/AnnouncementModal/AnnouncementModal";
import parse from 'html-react-parser';

const useStyles = makeStyles((theme) => ({
  content: {
    width: "100%",
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingLeft: '270px',
    marginTop: mainThemeEnum.marginNavbar(),
  },
  courseDrawerContent: {
    width: "70%",
    textAlign: "justify",
  },
  heading: {
    textTransform: 'uppercase'
  },
  addAnnouncementBox: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  addAnnouncementButton: {
    background: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: mainTheme.palette.primary.main,
      boxShadow: `-2px 2px 0px -1px ${mainTheme.palette.text.primary}`,
      transform: 'translate(2px, -2px)',
    },
    border: mainThemeEnum.border.medium,
    padding: mainTheme.spacing(1),
    transition: 'boxShadow 0s',
  },
  addAnnouncementIcon: {
    fontSize: theme.typography.fontSize * 1.5,
  },
  errorContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: '5%'
  }
}));

const CourseContent = () => {
  const classes = useStyles();
  const { accountState } = useContext(AuthContext);
  const { courseState } = useContext(CourseContext);
  const course = courseState.course;
  const teacher = courseState.teacher;
  const announcements = courseState.announcements;
  const courseProgress = courseState.courseProgress;

  const [showModal, setShowModal] = useState(false);
  const toggleShowModal = () => setShowModal(!showModal);
  const [mode, setMode] = useState(null);

  return (
    <main className={classes.content}>
      <div className={classes.courseDrawerContent}>
        <Typography className={classes.heading} variant={"h6"}>
          Description
        </Typography>
        <Typography variant={"body1"}>
          {parse(course.courseDescription)}
        </Typography>
        <br />

        <Typography className={classes.heading} variant={"h6"}>
          Taught By:
        </Typography>
        <AlignedTextIcon>
          <AccountCircleSharpIcon className={classes.icon} />
          <Typography>
            {teacher.firstName} {teacher.lastName}
          </Typography>
        </AlignedTextIcon>
        <AlignedTextIcon>
          <EmailIcon className={classes.icon}></EmailIcon>
          <Typography>{teacher.email}</Typography>
        </AlignedTextIcon>
        <br />

        {accountState.role === "teacher" ? null : (
          <>
            <Typography className={classes.heading} variant={"h6"}>
              Your Progress
            </Typography>
            <ProgressBar courseProgress={courseProgress} />
            <br />
          </>
        )}

        <Typography className={classes.heading} variant={"h6"}>Announcements</Typography>
        {Object.keys(announcements).length === 0 ? (
          <Container className={classes.errorContainer}>
            <AlignedTextIcon>
              <AnnouncementIcon />
              <Typography variant="body2">No announcements yet.</Typography>
            </AlignedTextIcon>
          </Container>
        ) : (
          <Announcements showState={showModal} close={toggleShowModal} />
        )}
        <br />

        {accountState.role === "teacher" ? (
          <Box className={classes.addAnnouncementBox}>
            <Fab
              size="medium"
              className={classes.addAnnouncementButton}
              aria-label="add course announcement"
              onClick={() => {
                setMode("create");
                toggleShowModal();
              }}
            >
              <AddIcon className={classes.addAnnouncementIcon} />
            </Fab>
          </Box>
        ) : null}

        <AnnouncementModal
          showModal={showModal}
          toggleShowModal={toggleShowModal}
          mode={mode}
          setMode={setMode}
        ></AnnouncementModal>
      </div>
    </main>
  );
};

export default CourseContent;
