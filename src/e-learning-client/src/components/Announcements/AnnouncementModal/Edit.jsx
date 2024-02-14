import {
  makeStyles,
  TextField,
  Typography,
  Grid,
  Box,
} from "@material-ui/core";
import { useContext, useState } from "react";
import { updateAnnouncement } from "../../../requests/announcementRequests";
import CourseContext from "../../../context/CourseContext";
import validator from "validator";
import fields from "../../../common/fields.enum";
import SubmitButton from "../../SubmitButton/SubmitButton";
import announcementModalStyles from "./styles/anouncementModalStyles";

const useStyles = makeStyles(announcementModalStyles.inputFormStyling);

const Edit = ({ setErrorData, setErrorSubmit, announcementId }) => {
  const classes = useStyles();
  const [isFetching, setFetching] = useState(false);
  
  const { courseState, setCourseState } = useContext(CourseContext);
  const announcement = courseState.announcements[announcementId];
  const [formData, setFormData] = useState({
    title: {
      name: "title",
      value: announcement.announcementTitle,
      isValid: true,
      validator: (value) => validator.isLength(value, {min: 3, max: 50}),
    },
    content: {
      name: "content",
      value: announcement.announcementContent,
      isValid: true,
      validator: (value) => validator.isLength(value, {min: 3}),
    },
  });

  const handleChangeTitle = (e) => {
    setFormData({
      ...formData,
      title: {
        ...formData.title,
        isValid: formData.title.validator(e.target.value),
        value: e.target.value,
      },
    });
  };

  const handleChangeContent = (e) => {
    setFormData({
      ...formData,
      content: {
        ...formData.content,
        isValid: formData.content.validator(e.target.value),
        value: e.target.value,
      },
    });
  };

  // Disables inner borders input fields
  const inputProp = {
    classes: { notchedOutline: classes.noBorder },
  };

  const handleSubmitAnnouncement = (e) => {
    e.preventDefault();
    setFetching(true);
    const announcementData = {
      announcementTitle: formData.title.value,
      announcementContent: formData.content.value,
      announcementCourseId: courseState.course.courseId,
      announcementId: announcementId,
    }
    updateAnnouncement(courseState.course.courseId, announcementData)
      .then((res) => {
        if (res.errorCode) {
          setFormData({
            title: {
              ...formData.title,
              isValid: false,
            },
            details: {
              ...formData.details,
              isValid: false,
            },
          });
          setErrorData(res);
          setErrorSubmit(true);
          setFetching(false);
          return;
        }
        const updatedAnnouncements = courseState.announcements;
        updatedAnnouncements[announcementId] = {
          ...courseState.announcements[announcementId],
          announcementTitle: formData.title.value,
          announcementContent: formData.content.value,
        }
        setCourseState({
          ...courseState,
          announcements : {
            ...updatedAnnouncements
          }
        })
        setFetching(false);
        setErrorSubmit(false);
      })
      .catch((err) => {});
  };

  return (
    <>
      <Typography variant="h5" className={classes.formTitle}>
        Edit Announcement
      </Typography>
      <form autoComplete="off" onSubmit={handleSubmitAnnouncement}>
        <Grid container spacing={2} className={classes.announcementForm}>
          <Grid item sm={12}>
            <Typography>Title</Typography>
            <TextField
              required
              variant="outlined"
              name={fields.announcementTitle}
              value={formData.title.value}
              className={classes.formInput}
              fullWidth
              onChange={handleChangeTitle}
              InputProps={inputProp}
              error={!formData.title.isValid}
              multiline
            />
          </Grid>
          <Grid item sm={12}>
            <Typography>Details</Typography>
            <TextField
              required
              variant="outlined"
              name={fields.announcementContent}
              value={formData.content.value}
              className={classes.formInput}
              fullWidth
              onChange={handleChangeContent}
              InputProps={inputProp}
              error={!formData.content.isValid}
              multiline
            />
          </Grid>
        </Grid>

        <Box className={classes.submitButton}>
          <SubmitButton
            placeholder="submit"
            isFetching={isFetching}
            disableIf={
              !formData.title.isValid ||
              !formData.content.isValid ||
              formData.title.value === '' ||
              formData.content.value === '' ||
              isFetching
            }
          />
        </Box>
      </form>
    </>
  );
};

export default Edit;
