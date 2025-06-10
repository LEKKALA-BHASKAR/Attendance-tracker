import PropTypes from 'prop-types';

export const userPropTypes = {
  id: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  role: PropTypes.oneOf(['admin', 'employee', 'student']).isRequired,
  dept: PropTypes.string,
  createdAt: PropTypes.string.isRequired
};

export const authStatePropTypes = {
  currentUser: PropTypes.shape(userPropTypes),
  isAuthenticated: PropTypes.bool.isRequired
};