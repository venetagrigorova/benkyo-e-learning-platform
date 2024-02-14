import { makeStyles } from '@material-ui/core';
import { useLayoutEffect, useRef } from 'react';
const useStyles = makeStyles((theme) => ({
  bodyAttachment: {
    width: '100%'
  },
}));

const BodyAttachment = ({ attachment }) => {
  const elRef = useRef();
  const classes = useStyles();

  const wrapper = document.createElement('div');
  wrapper.innerHTML = attachment;
  const attachmentHTML = wrapper.firstChild;
  const attachmentTagName = attachmentHTML.tagName;

  useLayoutEffect(() => {
    if (elRef.current) {
      const content = elRef.current.firstElementChild;

      content.style.border = 'none';
      content.style.overflow = 'hidden';
    }
  }, [attachmentTagName]);

  return (
    <div className={classes.attachmentContainer}>
      <div
        className={classes.bodyAttachment}
        ref={elRef}
        dangerouslySetInnerHTML={{ __html: attachment }}
      />
    </div>
  );
};

export default BodyAttachment;


