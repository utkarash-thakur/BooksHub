import { Component, Output , EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient  } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent  {

  registrationForm: FormGroup;

 constructor(private fb: FormBuilder, private router: Router, private http:HttpClient)
 {
  this.registrationForm = this.fb.group({

   firstName:['',[Validators.required,Validators.minLength(3)]],
   lastName:['',[Validators.required,Validators.minLength(3)]],
   email:['',[Validators.required,Validators.email],this.uniqueEmailValidator()],
   role:[false],
   password:['',[Validators.required,Validators.minLength(6), this.passwordStrengthValidator()]],
  confirmPassword:['',[Validators.required, this.matchPassowrdValidator()]],
  });
 }
  
 uniqueEmailValidator() {
  return (control: AbstractControl): Promise<{ [key: string]: any } | null> => {
    return new Promise((resolve) => {
      const email = control.value;
      const existingUserProfiles = JSON.parse(localStorage.getItem('userProfiles') || '[]');
      let isValid: boolean = true;

      for (let i = 0; i < existingUserProfiles.length; i++) {
        if (existingUserProfiles[i].email == email) {
          isValid = false;
          break;
        }
      }

      // Use `resolve` to return validation results (null for valid, an object for invalid)
      isValid ? resolve(null) : resolve({ emailTaken: true });
    });
  };
}


 passwordStrengthValidator()
 {
return (control: AbstractControl)=>
{
  const value = control.value;
  const hasUpperCase =/[A-Z]/.test(value);
  const hasLowerCase =/[a-z]/.test(value);
  const hasDigit =/[0-9]/.test(value);
  const hasSpecialChar =/[!@#$%^&*()_+]/.test(value);

  const isValid =

  hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar; 
  return isValid ? null :{passwordStrength: true};
}


 }


 matchPassowrdValidator()
 {
   return (control:AbstractControl)=>
   {
    if(this.registrationForm)
    {
    const confirmPasswordValue = control.value;
    const passwordValue = this.registrationForm.get('password')?.value;
 
    return confirmPasswordValue == passwordValue? null :{passwordMismatch:true};
    }
    return null;
   }
}


@Output()
submitted= new EventEmitter<any>();


onSubmit() {
  if (this.registrationForm.valid) {
    
   
    const formData: RegistrationRequest =
    {
      name: this.registrationForm.value.firstName+" "+this.registrationForm.value.lastName,
      email:this.registrationForm.value.email,
      password:this.registrationForm.value.password,
      role: this.getRoleFromCheckbox(this.registrationForm.value.role)
    }

  console.log(this.registrationForm);


    // Send registration request to the backend
    this.http.post(`${environment.apiUrl}/auth/register`, formData).subscribe(
      (response) => {
        Swal.fire({
          title: 'Success',
          text: "Registration successfully.",
          icon: 'success',
          timer: 1500
        })
       
        this.router.navigate(['/login']);
      },
      (error) => {
       
        Swal.fire({
          title: 'Error!',
          text: "Error in register please trying different email or try again later.",
          icon: 'error',
          confirmButtonText: 'Cool'
        })
      }
    );
  } else {
    Swal.fire({
      title: 'Error',
      text: "Details are not valid please check again.",
      icon: 'success',
      timer: 1500
    })
    this.registrationForm.markAllAsTouched();
  }
}

getRoleFromCheckbox(checkboxValue: boolean): string {
  return checkboxValue ? 'AUTHOR' : 'USER';
}

  passwordVisible: boolean = false; // Add this property
  passwordFieldType: string = 'password'; // Add this property


  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    this.passwordFieldType = this.passwordVisible ? 'text' : 'password';
  }



    
  
  
}
interface RegistrationRequest {
  name: string;
  email: string;
  role: string;
  password: string;
}


