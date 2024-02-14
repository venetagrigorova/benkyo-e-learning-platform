import { InputBase, makeStyles } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useContext, useEffect, useState } from 'react';
import mainTheme from '../../themes/main.theme';
import mainThemeEnum from '../../themes/main.theme.enum';
import { useHistory } from 'react-router-dom';
import CatalogueContext from '../../context/CatalogueContext';
import qs from 'query-string';

const useStyles = makeStyles((theme) => ({
  checkedRadio: {
    color: mainTheme.palette.text.primary,
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(6)}px)`,
    width: '80%',
    fontSize: mainTheme.typography.fontSize * 2,
    color: mainTheme.palette.text.primary,
    transition: theme.transitions.create('width'),

    [theme.breakpoints.up('sm')]: {
      width: '8ch',
      '&:focus': {
        width: '14ch',
      },
    },
    '&::placeholder': {
      color: mainTheme.palette.text.primary,
      opacity: 1,
    },
  },
  radioContainer: {
    marginRight: mainTheme.spacing(4),
  },
  radioIcon: {
    width: mainTheme.typography.fontSize,
    height: mainTheme.typography.fontSize,
    marginLeft: mainTheme.spacing(2),
    transition: 'all 0s',
    color: mainTheme.palette.text.primary,
    '&.PrivateRadioButtonIcon-root-30': {
      color: mainTheme.palette.text.primary,
    },
  },
  search: {
    position: 'relative',
    '&:hover': {},
    marginLeft: 0,
    width: '100%',
    display: 'flex',
  },
  searchForm: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  searchIcon: {
    fontSize: mainTheme.typography.fontSize * 3,
    marginRight: mainTheme.spacing(2),
  },
  searchIconContainer: {
    padding: mainTheme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButton: {
    padding: '0',
    border: mainThemeEnum.borderPlaceholder.medium,
    backgroundColor: 'rgba(0,0,0,0)',
    color: mainTheme.palette.text.primary,
    fontSize: mainTheme.typography.fontSize * 2,
    '&.Mui-selected': {
      color: mainTheme.palette.text.primary,
      border: mainThemeEnum.border.medium,
      backgroundColor: 'rgba(0,0,0,0)',
      '&:hover': {
        backgroundColor: 'rgba(0,0,0,0)',
      },
    },
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0)',
    },
    '& > *': {
      fontSize: mainTheme.typography.fontSize * 1,
    },
  },
  toggleButtonGroup: {
    marginRight: mainTheme.spacing(2),
    padding: '0',
    border: 'none',
  },
}));

const SearchButton = () => {
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const { catalogueState, setCatalogueState } = useContext(CatalogueContext);
  const history = useHistory();

  // Fills search bar with URL params (if page loaded with URL)
  useEffect(() => {
    const { search } = qs.parse(window.location.search);
    if (!!search) {
      setSearch(search);
    }
  }, []);

  const handleChangeTerm = (e) => {
    setSearch(e.target.value);

    if (!e.target.value) {
      setCatalogueState({
        ...catalogueState,
        search: '',
      });
    }
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();

    setCatalogueState({
      ...catalogueState,
      search,
    });

    history.push(
      `/catalogue?${
        !!catalogueState.activeTopics.length
          ? qs.stringify(
              {
                categories: catalogueState.activeTopics.map((i) => i.topicName),
              },
              { arrayFormat: 'bracket-separator', arrayFormatSeparator: '|' }
            ) + '&'
          : ''
      }${qs.stringify({ search }, { skipNull: true })}`
    );
    window.title = 'Search | Benkyō';
  };

  return (
    <>
      <div className={classes.search}>
        <div className={classes.searchIconContainer}>
          <SearchIcon className={classes.searchIcon} />
        </div>
        <form className={classes.searchForm} onSubmit={handleSubmitSearch}>
          <InputBase
            placeholder={'Search...'}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
            value={search}
            onChange={handleChangeTerm}
          />
        </form>
      </div>
    </>
  );
};

export default SearchButton;
