import {  makeStyles } from '@material-ui/core';
import { useLayoutEffect, useRef } from 'react';
import parse from 'html-react-parser';

const useStyles = makeStyles((theme) => ({
  // iframeAttachment: {
  // },
}));

const IFrameAttachment = ({ attachment }) => {
  const elRef = useRef();
  const classes = useStyles();

  useLayoutEffect(() => {
    if (elRef.current) {
      const orientation = parse(attachment).props.orientation;
      const content = elRef.current.firstElementChild;
      if (orientation === 'portrait') {
        content.style.height = '80vh';
        content.style.width = '100%';
        content.style.border = 'none';
        content.style.overflow = 'hidden';
        content.style.scrollbarWidth = 'none';
      } else if (orientation === 'landscape') {
        content.style.width = '100%';
        content.style.border = 'none';
        content.style.overflow = 'hidden';
        content.style.scrollbarWidth = 'none';
      } else {
        content.style.width = '100%';
        content.style.border = 'none';
        content.style.overflow = 'hidden';
        content.style.scrollbarWidth = 'none';
      }
    }
  }, [attachment]);

  return (
    <div
      className={classes.iframeAttachment}
      ref={elRef}
      dangerouslySetInnerHTML={{ __html: attachment }}
    />
  );
};

export default IFrameAttachment;
