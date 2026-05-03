import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router'; 
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      role:[false]
    });
  }
 


  onSubmit() {
    
     const requestBody ={'email': this.loginForm.value.email,
                         'password':this.loginForm.value.password,
                         'role':this.loginForm.value.role?"USER":"AUTHOR"};
                         const headers = new HttpHeaders({
                          'Authorization': 'Basic ' + btoa(requestBody.email + ":" + requestBody.password),
                        })

    this.http.get(`${environment.apiUrl}/auth/login`, { headers,responseType:'text' as 'json',observe:'response'}).subscribe(
      (response:any) => {
        
        localStorage.setItem('token',response.headers.get('Authorization'))

        const user = JSON.parse(response.body);

        // Store user information in localStorage
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirect to the login component
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Login successfully"
        });
        this.router.navigate(['/']);
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          icon: 'error',
          confirmButtonText: 'Try again'
        })
      }
    );
   
  }
}
