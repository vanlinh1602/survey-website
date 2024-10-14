export const BACKEND =
  import.meta.env.REACT_APP_STAGE === 'development'
    ? 'http://localhost:5053'
    : '';
