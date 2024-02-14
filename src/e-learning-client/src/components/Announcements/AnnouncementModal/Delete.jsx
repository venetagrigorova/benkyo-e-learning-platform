import {
  makeStyles,
  Typography,
  Box,
} from "@material-ui/core";
import { useContext, useState } from "react";
import { deleteAnnouncement } from "../../../requests/announcementRequests";
import CourseContext from "../../../context/CourseContext";
import SubmitButton from "../../SubmitButton/SubmitButton";
import announcementModalStyles from "./styles/anouncementModalStyles";

const useStyles = makeStyles(announcementModalStyles.deletePanelStyling);

const Delete = ({ setErrorData, setErrorSubmit, announcementId }) => {
  const classes = useStyles();
  const [isFetching, setFetching] = useState(false);

  const { courseState, setCourseState } = useContext(CourseContext);

  const handleSubmitAnnouncement = (e) => {
    e.preventDefault();
    setFetching(true);

    deleteAnnouncement(courseState.course.courseId, announcementId)
      .then((res) => {
        if (res.errorCode) {
          setErrorData(res);
          setErrorSubmit(true);
          setFetching(false);
          return;
        }
        const updatedAnnouncements = courseState.announcements;
        delete updatedAnnouncements[announcementId];
        setCourseState({
          ...courseState,
          announcements: {
            ...updatedAnnouncements,
          },
        });
        setFetching(false);
        setErrorSubmit(false);
      })
      .catch((err) => {});
  };

  return (
    <>
      <Typography variant="h5" className={classes.formTitle}>
        Delete Announcement
      </Typography>
      <form autoComplete="off" onSubmit={handleSubmitAnnouncement}>
        <Typography>
          Are you 109325239562% sure you want to yeet this announcement?
        </Typography>
        <Box className={classes.submitButton}>
          <SubmitButton
            placeholder="yes, i want it gone"
            isFetching={isFetching}
            disableIf={isFetching}
          />
        </Box>
      </form>
    </>
  );
};

export default Delete;
