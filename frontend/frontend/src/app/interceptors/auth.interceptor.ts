import { HttpInterceptorFn } from '@angular/common/http';

/**
 * 📌 Interceptor de autenticación JWT
 *
 * Este interceptor añade automáticamente el token JWT a las cabeceras
 * de todas las peticiones HTTP salientes si el usuario está autenticado.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');

  if (token) {
    const reqConToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(reqConToken);
  }

  return next(req);
};
