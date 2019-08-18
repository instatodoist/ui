import 'izitoast/dist/css/iziToast.min.css';
import iZtoast from 'izitoast';

// iZtoast.settings({
//   timeout: 5000000000,
//   // backgroundColor: '#FFFFFF',
// });

const toast = {
  error: (message, title = 'Error') => iZtoast.error({
    title,
    message,
    position: 'bottomCenter',
  }),
  success: (message, title = 'Success') => iZtoast.success({
    title,
    message,
    position: 'bottomCenter',
  }),
};

export default toast;
