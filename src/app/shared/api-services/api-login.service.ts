import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiLoginService {

  constructor(private _httpClient: HttpClient) { }

  login(loginForm: any) {
    return this._httpClient.post(environment.baseUrl + "public/login", loginForm);
  }
}
