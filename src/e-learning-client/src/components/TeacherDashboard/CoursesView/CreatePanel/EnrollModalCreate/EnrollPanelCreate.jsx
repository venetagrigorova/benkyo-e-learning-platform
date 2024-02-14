import {
  Container,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { useContext, useEffect, useState } from 'react';
import dataGridBaseColumns from '../../../../../common/dataGridBaseColumn';
import mainThemeEnum from '../../../../../themes/main.theme.enum';
import SearchIcon from '@material-ui/icons/Search';
import PeopleIcon from '@material-ui/icons/People';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { StyledSubmitButton } from '../../../../SubmitButton/SubmitButton';
import TeacherContext from '../../../../../context/TeacherContext';
import MakePanel from '../../CourseStats/EnrollModal/Utils/MakePanel';

const useStyles = makeStyles((theme) => ({
  root: {
    border: 0,
    '& .MuiDataGrid-mainGridContainer': {
      maxHeight: '800px',
    },
  },
  buttonLabel: {
    fontWeight: theme.typography.fontWeightBold,
  },
  deleteIcon: {
    fontSize: theme.typography.fontSize * 2,
    marginRight: theme.spacing(1),
    cursor: 'pointer',
    '& :hover': {
      color: theme.palette.error.main,
    },
  },
  formInput: {
    backgroundColor: theme.palette.common.white,
    maxWidth: theme.spacing(50),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  icon: {
    fontSize: theme.typography.fontSize * 2,
    color: theme.palette.primary.main,
    marginRight: theme.spacing(1),
  },
  noBorder: {
    border: mainThemeEnum.border.medium,
  },
  greenText: {
    color: theme.palette.primary.main,
  },
  pickedContainer: {
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(1),
    border: mainThemeEnum.border.medium,
    maxHeight: '500px',
    overflow: 'auto',
  },
  selectedContainer: {
    padding: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
}));

const EnrollPanelCreate = ({
  unenrolled,
  // setUnenrolled,
  // coursePermissions,
  formData,
  setFormData,
}) => {
  const classes = useStyles();
  const columns = dataGridBaseColumns;
  const { teacherState, setTeacherState } = useContext(TeacherContext);
  const [activeColumn, setActiveColumn] = useState('');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    setStudents(teacherState.createCourse.coursePermissions.value);
  }, [teacherState]);

  const [filterModel, setFilterModel] = useState({
    items: [{ columnField: 'email', operatorValue: 'contains', value: '' }],
  });
  const [page, setPage] = useState(0);

  const handleChangeSearch = (e) => {
    const value = e.target.value;

    setFilterModel({
      items: [{ ...filterModel.items[0], value }],
    });
  };

  const handleChangeSelection = (e) => {
    setStudents(e);
  };

  const handleColumnSelection = (e) => {
    setActiveColumn(e.colDef.headerName.toLowerCase());
  };

  const inputProp = {
    classes: { root: classes.inputRoot, notchedOutline: classes.noBorder },
  };

  const handleRemove = (e) => {
    const removeId =
      e.target.parentElement.getAttribute('data-remove-id') ||
      e.target.getAttribute('data-remove-id');
    setStudents(students.filter((id) => id !== +removeId));
  };

  const handleEnroll = (e) => {
    setFormData({
      ...formData,
      coursePermissions: {
        ...formData.coursePermissions,
        value: students,
      },
    });
    teacherState.handleCloseEnrollModal();
  };

  return (
    <MakePanel>
      <Grid container spacing={2} wrap='wrap'>
        <Grid item md={4} lg={6} xs={12}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SearchIcon className={classes.icon} />
            <Typography variant={'h5'}>
              {activeColumn.length ? (
                <>
                  Search for new students by{' '}
                  <span className={classes.greenText}>{activeColumn}</span>
                </>
              ) : (
                'Please choose on a column to filter your search :)'
              )}
            </Typography>
          </div>

          <TextField
            required
            variant='outlined'
            name={filterModel.items[0].columnField}
            value={filterModel.items[0].value}
            className={classes.formInput}
            fullWidth
            onChange={handleChangeSearch}
            InputProps={inputProp}
          />
          {students[0] ? (
            <>
              {' '}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <PeopleIcon className={classes.icon} />
                <Typography variant={'h5'} style={{ flexGrow: '1' }}>
                  Selected students ({students.length}):
                </Typography>
                <StyledSubmitButton
                  style={{ marginTop: '0' }}
                  onClick={handleEnroll}
                >
                  <Typography>ENROLL!</Typography>
                </StyledSubmitButton>
              </div>
              <Container className={classes.pickedContainer}>
                {students.map((id) => {
                  const user = unenrolled.find((user) => user.id === +id);
                  return (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Grid item xs={1} ms={1}>
                          <div
                            className={classes.deleteIcon}
                            onClick={handleRemove}
                            data-remove-id={id}
                          >
                            <RemoveCircleOutlineIcon />
                          </div>
                        </Grid>
                        <Grid item xs={11} ms={11}>
                          <Grid container className={classes.selectedContainer}>
                            <Grid
                              item
                              xs={12}
                              ms={6}
                              className={classes.gridItemNoBorder}
                            >
                              <Typography>{user.email}</Typography>
                            </Grid>
                            <Grid
                              item
                              xs={3}
                              ms={0}
                              className={classes.gridItemNoBorder}
                            />
                            <Grid
                              item
                              xs={9}
                              ms={6}
                              className={classes.gridItemNoBorder}
                            >
                              <Typography className={classes.greenText}>
                                {user.firstName +
                                  ' ' +
                                  user.lastName.toUpperCase()}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </div>
                    </>
                  );
                })}
              </Container>
            </>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item md={8} lg={6} xs={12} style={{ maxHeight: '800px' }}>
          <DataGrid
            className={classes.root}
            columns={columns}
            rows={unenrolled}
            autoHeight
            columnResizeIcon
            filterModel={filterModel}
            checkboxSelection
            pageSize={10}
            rowsPerPageOptions={[10]}
            page={page}
            onPageChange={(newPage) => setPage(newPage)}
            selectionModel={students}
            onSelectionModelChange={handleChangeSelection}
            onColumnHeaderClick={handleColumnSelection}
          />
        </Grid>
      </Grid>
    </MakePanel>
  );
};

export default EnrollPanelCreate;
