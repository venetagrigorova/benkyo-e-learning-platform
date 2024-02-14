import { Box, makeStyles } from '@material-ui/core';

import AceEditor from 'react-ace-builds';
import 'brace/mode/markdown';
import 'brace/mode/html';
import 'brace/theme/solarized_light';
import mainThemeEnum from '../../../../../themes/main.theme.enum';
import fields from '../../../../../common/fields.enum';
import MakePanel from '../Utils/MakePanel';

const useStyles = makeStyles((theme) => ({
  aceBody: {
    borderTop: mainThemeEnum.border.bold,
    padding: 0,
  },
}));

const EditorTab = ({ lessonBody, setFormData }) => {
  const classes = useStyles();

  const handleBodyChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      lessonBody: {
        ...prev.lessonBody,
        value: e,
      },
    }));
  };

  return (
    <>
      <MakePanel>
        <Box className={classes.aceBody}>
          <AceEditor
            placeholder='Placeholder Text'
            mode='html'
            theme='solarized_light'
            name={fields.lessonBody}
            onChange={handleBodyChange}
            fontSize={16}
            width='100%'
            wrapEnabled
            style={{ fontFamily: `'Roboto Mono', monospace` }}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={lessonBody.value}
          />
        </Box>
      </MakePanel>
    </>
  );
};

export default EditorTab;
