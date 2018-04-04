import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export class CustomInterceptor {

    constructor() {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const headers = new HttpHeaders({
            'Authorization': localStorage.getItem('jwtToken')
        });

        request.clone({ headers, withCredentials: true });

        return next.handle(request);
    }

}
