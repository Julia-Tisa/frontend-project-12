const apiPath = 'api/v1';

export default {
  loginPath: () => [apiPath, 'login'].join('/'),
  registrationPath: () => [apiPath, 'signup'].join('/'),
  dataPath: () => [apiPath, 'data'].join('/'),
  pageChatPath: () => '/',
  pageFormPath: () => '/login',
  page404Path: () => '*',
  pageRegistrationPath: () => '/signup',
};
