const apiPath = 'api/v1';

export default {
  loginPath: () => [apiPath, 'login'].join('/'),
  registrationPath: () => [apiPath, 'signup'].join('/'),
  dataPath: () => [apiPath, 'data'].join('/'),
  pageChatPath: () => '/',
  pageLogInPath: () => '/login',
  page404Path: () => '*',
  pageSignUpPath: () => '/signup',
};
