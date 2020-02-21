import {createMuiTheme} from '@material-ui/core';
import MEDIA_BREAKPOINTS from 'constants/mediaBreakpoints';

const materialTheme = createMuiTheme({
  breakpoints: {
    values: MEDIA_BREAKPOINTS,
  },
  props: {
    MuiGrid: {
      spacing: 2,
      alignItems: 'flex-start',
    },
  },
  overrides: {
    MuiGrid: {
      container: {
        marginTop: '0 !important',
        marginBottom: '0 !important',
      },
      item: {
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
      },
    },
  },
});

export default materialTheme;
