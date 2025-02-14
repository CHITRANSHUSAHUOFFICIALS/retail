import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { catchError, finalize, map, Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';
import { SpinnerService } from 'src/app/shared/loader/spinner.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private requestCount = 0;

  constructor(
    private spinnerService: SpinnerService,
    private _authService: AuthService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from local storage
    const accessToken = localStorage.getItem('AUTH_TOKEN');

    // Increment the request count when a request is initiated
    this.requestCount++;
    this.spinnerService.display(true);

    // Clone the request and add the authorization header
    request = request.clone({
      headers: request.headers.set('Accept', 'application/json')
    });

    if (environment.production && accessToken && accessToken !== "undefined") {
      request = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });
    }

    // Handle the request and response
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (!environment.production) {
            console.log('event--->>>', event);
          }
          // Decrement the request count when a response is received
          this.requestCount--;
          if (this.requestCount === 0) {
            this.spinnerService.display(false); // Hide the spinner when no pending requests
          }
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        // Decrement the request count when an error occurs
        this.requestCount--;
        if (this.requestCount === 0) {
          this.spinnerService.display(false); // Hide the spinner when no pending requests
        }

        // Handle 401 Unauthorized errors
        if (error.status === 401) {
          this._authService.performLogoutAction();
        }
        if (error.status === 0) {
          // Handle other error scenarios as needed
        }
        return throwError(() => error);
      }),
      // Use the finalize operator to ensure the spinner is hidden even if an error occurs
      finalize(() => {
        if (this.requestCount === 0) {
          this.spinnerService.display(false); // Hide the spinner when no pending requests
        }
      })
    );
  }
}
