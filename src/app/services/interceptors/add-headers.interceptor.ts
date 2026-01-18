import {HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from '@angular/common/http';
import {Observable} from 'rxjs';

export const CONTENT_TYPE = new HttpContextToken(() => 'application/json');
export const ACCEPT = new HttpContextToken(() => 'application/json');
export const TOKEN = new HttpContextToken(() => '');

/**
 * Intercepte toutes les requêtes HTTP de l'application et configure les entêtes HTTP
 * Ajoute au besoin le jeton pour la version mobile
 * https://laravel.com/docs/10.x/sanctum#mobile-application-authentication
 */
export class AddHeadersInterceptor implements HttpInterceptor {
  // eslint-disable-next-line
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // eslint-disable-next-line
    let modifiedRequest: HttpRequest<any>;
    if (req.context.get(TOKEN)) {
      modifiedRequest = req.clone({
        setHeaders: {
          'Accept': req.context.get(ACCEPT),
          'withCredentials': 'true',
          'Authorization': 'Bearer ' + req.context.get(TOKEN),
        }
      })
    } else {
      modifiedRequest = req.clone({
        setHeaders: {
          'Accept': req.context.get(ACCEPT),
          'withCredentials': 'true',
          'Content-type' : req.context.get(CONTENT_TYPE),
        }
      });
    }
    return next.handle(modifiedRequest);
  }
}
