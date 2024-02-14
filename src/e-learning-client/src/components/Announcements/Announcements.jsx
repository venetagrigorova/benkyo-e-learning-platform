import { Box, makeStyles, Typography } from "@material-ui/core";
import { useContext } from "react";
import CourseContext from "../../context/CourseContext";
import AlignedTextIcon from "../MicroComponents/AlignedTextIcon";
import SingleAnnouncement from "./SingleAnnouncement";
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import mainTheme from "../../themes/main.theme";

const useStyles = makeStyles({
  announcements: {
    display: "flex",
    flexDirection: "column",
  },
  noAnnouncementsMessage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: mainTheme.spacing(3),
  }
});

const Announcements = ({ showState, close }) => {
  const classes = useStyles();
  const { courseState } = useContext(CourseContext);

  const announcements = courseState.announcements;
  const announcementsArray = [];
  for (const announcement in announcements) {
    announcementsArray.push(announcements[announcement]);
  }

  return (
    <div className={classes.announcements}>
      {courseState.announcements.length === 0 ? (
        <Box className={classes.noAnnouncementsMessage}>
          <AlignedTextIcon>
            <NotificationImportantIcon />
            <Typography variant={"body2"}>No announcements to show.</Typography>
          </AlignedTextIcon>
        </Box>
      ) : (
        <Box className={classes.announcements}>
          {announcementsArray.length !== 0 ? (
            announcementsArray.map((announcement) => (
            <SingleAnnouncement
              key={`${announcement.announcementId}${announcement.announcementTitle}${announcement.announcementContent}`}
              announcement={announcement}
              showState={showState} 
              close={close}
            />
          ))
          ) : (
            null
          )}
        </Box>
      )}
    </div>
  );
};

export default Announcements;
