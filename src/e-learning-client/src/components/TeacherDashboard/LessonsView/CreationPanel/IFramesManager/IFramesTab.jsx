import {
  Box,
  IconButton,
  InputBase,
  makeStyles,
  Typography,
} from '@material-ui/core';
import MakePanel from '../Utils/MakePanel';
import mainThemeEnum from '../../../../../themes/main.theme.enum';
import fields from '../../../../../common/fields.enum';
import AceEditor from 'react-ace-builds';
import 'brace/mode/html';
import { useState } from 'react';
import parse from 'html-react-parser';
import IframesSummary from './IframesSummary';
import AddRoundedIcon from '@material-ui/icons/AddRounded';

const useStyles = makeStyles((theme) => ({
  aceBody: {
    borderTop: mainThemeEnum.border.medium,
    borderBottom: mainThemeEnum.border.medium,
    padding: 0,
  },
  addButton: {
    color: theme.palette.common.black,
    border: mainThemeEnum.border.medium,
    height: theme.spacing(4),
    width: theme.spacing(4),
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      transform: 'translate(2px, -2px)',
      boxShadow: `-2px 2px ${theme.palette.common.black}`,
    },
    transition: 'all 0s',
  },
  disabled: {
    border: 'none',
  },
  submitButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(2),
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  title: {
    marginRight: theme.spacing(1),
  },
  textField: {
    fontSize: theme.typography.fontSize * 1.5,
    fontWeight: theme.typography.fontWeightRegular,
    color: theme.palette.primary.main,
  },
}));

const IFramesTab = ({ lessonIframes, setFormData }) => {
  const classes = useStyles();
  const [iframe, setIframe] = useState('');
  const [title, setTitle] = useState('');
  const [isValidIframes, setValidIframes] = useState(false);
  const [iframeArray, setIframeArray] = useState([]);

  const handleIframesChange = (e) => {
    setIframe(e);

    // Checks only one element was added
    const parsedIframes = parse(e);

    if (Array.isArray(parsedIframes)) {
      setValidIframes(false);
      return;
    }

    // Parsed the string to HTML and invalid if not valid element
    const container = document.createElement('div');
    container.innerHTML = e;
    const htmlIframe = container.firstChild;

    if (!htmlIframe) {
      setValidIframes(false);
      return;
    }

    setValidIframes(true);
  };

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleAddIframes = (e) => {
    e.preventDefault();

    // parsed the string to HTML and sets title and order
    const container = document.createElement('div');
    container.innerHTML = iframe;
    const htmlIframe = container.firstChild;
    htmlIframe.setAttribute('title', title);
    htmlIframe.setAttribute('order', lessonIframes.length + 1);
    htmlIframe.setAttribute('orientation', 'portrait');

    const cleanHtml = htmlIframe.outerHTML.replace(/(\r\n|\n|\r)/gm, ' ');

    setTitle('');
    setIframe('');

    setIframeArray([...iframeArray, cleanHtml]);
    setFormData((formData) => ({
      ...formData,
      lessonIframes: {
        ...formData.lessonIframes,
        value: [...lessonIframes, cleanHtml],
      },
    }));
  };

  const inputProp = {
    classes: { notchedOutline: classes.noBorder },
  };

  return (
    <>
      <MakePanel>
        <div className={classes.titleContainer}>
          <Typography variant={'h6'} className={classes.title}>
            Name:
          </Typography>

          <InputBase
            variant='outlined'
            name={fields.lessonTitle}
            value={title}
            className={classes.textField}
            onChange={handleChangeTitle}
            InputProps={inputProp}
            fullWidth
            multiline
          />
        </div>

        <Box className={classes.aceBody}>
          <AceEditor
            placeholder='Placeholder Text'
            mode='html'
            theme='solarized_light'
            name={fields.lessonIframesTitle}
            onChange={handleIframesChange}
            fontSize={16}
            width='100%'
            height='100px'
            style={{ fontFamily: `'Roboto Mono', monospace` }}
            wrapEnabled
            showGutter={true}
            highlightActiveLine={true}
            value={iframe}
          />
        </Box>
        <div className={classes.submitButtonContainer}>
          <IconButton
            onClick={handleAddIframes}
            button
            disabled={!title || !isValidIframes}
            className={classes.addButton}
            classes={{ disabled: classes.disabled }}
          >
            <AddRoundedIcon />
          </IconButton>
        </div>
        <IframesSummary
          lessonIframes={lessonIframes}
          setFormData={setFormData}
        />
      </MakePanel>
    </>
  );
};

export default IFramesTab;
