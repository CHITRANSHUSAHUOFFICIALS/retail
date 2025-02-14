import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiLoginService } from 'src/app/shared/api-services/api-login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup | any;

  constructor(private formBuilder: FormBuilder,
    private _loginService: ApiLoginService,
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", [Validators.required]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      this._loginService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          let data = res.response.data;
          if (data.token) {
            localStorage.setItem("AUTH_TOKEN", data.token);
          }
          //load initail data and set token
          console.log("Login success");
        },
        error: () => {
          console.error("Login faild");
        }
      })
    }
  }
}
