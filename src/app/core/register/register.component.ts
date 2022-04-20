import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LoginService} from '../../service/login.service';


declare var Swal: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  message = '';

  constructor(private fb: FormBuilder,
              private loginService: LoginService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  // tslint:disable-next-line:typedef
  register() {
    const user = {
      name: this.registerForm.value.name,
      address: this.registerForm.value.address,
      phone: this.registerForm.value.phone,
      email: this.registerForm.value.email,
      username: this.registerForm.value.username,
      password: this.registerForm.value.password
    };
    this.loginService.register(user).subscribe(data => {
        // console.log(data);
        this.message = data.message;
        console.log(this.message);
    },
      error => {
        this.message = 'Tài khoản hoặc mật khẩu không đúng yêu cầu. Vui lòng đăng ký lại';
      });
  }
}
