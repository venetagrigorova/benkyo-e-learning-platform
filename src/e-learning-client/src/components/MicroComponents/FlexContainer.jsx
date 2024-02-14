const FlexContainer = ({
  children,
  justifyContent = 'center',
  alignItems = 'center',
  alignContent = 'center',
  flexDirection = 'row',
  height = 'auto',
  width = 'auto',
  ...props
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent,
        alignItems,
        alignContent,
        flexDirection,
        height,
        width,
        ...props,
      }}
    >
      {children}
    </div>
  );
};

export default FlexContainer;
