// import localStorageService from './localStorage';

function requireAuth(to, from, next) {
  if (localStorage.getItem('token')) {
    return next();
  }
  return next('/login');
}

export default requireAuth;
