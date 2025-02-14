import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private spinnerSubject = new BehaviorSubject<boolean>(false);
  spinnerState = this.spinnerSubject.asObservable();

  constructor() { }

  display(show: boolean) {
    this.spinnerSubject.next(show);
  }

}