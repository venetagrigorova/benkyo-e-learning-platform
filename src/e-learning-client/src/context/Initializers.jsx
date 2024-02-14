const Initializers = {
  createCourse: {
    courseTitle: {
      name: 'courseTitle',
      value: '',
      isValid: true,
      validator: (value) =>
        typeof value === 'string' && value.length >= 3 && value.length <= 100,
    },
    courseDescription: {
      name: 'courseDescription',
      value: '',
      isValid: true,
      validator: (value) => typeof value === 'string' && value.length > 20,
    },
    courseIsprivate: {
      name: 'courseIsprivate',
      value: false,
    },
    courseDateRestriction: {
      value: null,
    },
    coursePermissions: {
      value: [],
    },
  },
};

export default Initializers;
