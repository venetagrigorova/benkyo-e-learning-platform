import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import IFrameAttachment from "./IFrameAttachment";
import mainThemeEnum from "../../../themes/main.theme.enum";
import parse from 'html-react-parser';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    height: '100%',
    transition: 'boxShadow 0s',
    // overflow: 'hidden'
  },
  appBar: {
    transition: 'boxShadow 0s',
    borderBottom: mainThemeEnum.border.bold,
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabPanel${index}`}
      aria-labelledby={`tab${index}`}
      {...other}
    >
      {value === index && (
        <Box className={classes.attachmentBox}>
          {children}
        </Box>

      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
export default function InnerTabs({ attachments }) {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const HTMLattachments = attachments.map((attachment) => parse(attachment));
  const tabTitles = HTMLattachments.map((attachment) => attachment.props.title);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar className={classes.appBar} position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="wrapped label tabs"
        >
          {
            tabTitles.map((tabTitle, index) => 
              <Tab
                key={index}
                value={index}
                label={`${tabTitle}`}
                wrapped
                id={`tab${index}`}
                aria-controls={`tabPanel${index}`}
              />
            )
          }
        </Tabs>
      </AppBar>
      {
        attachments.map((attachment, index) => 
          <TabPanel key={attachment} value={value} index={index}>
            <IFrameAttachment attachment={attachment} />
          </TabPanel>
        )
      }
    </div>
  );
}
