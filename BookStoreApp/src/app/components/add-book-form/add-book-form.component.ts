import { Component ,OnInit} from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder,FormGroup,Validators,AbstractControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-add-book-form',
  templateUrl: './add-book-form.component.html',
  styleUrls: ['./add-book-form.component.css']
})
export class AddBookFormComponent implements OnInit{




  bookForm: FormGroup;

  constructor(
    private http:HttpClient,
    private router :Router,
    
    private fb:FormBuilder
  ){

    this.bookForm = this.fb.group({
      title: ['', [Validators.required,Validators.minLength(3)]],
      description: ['', [Validators.required,Validators.minLength(3)]],
      pageCount: [null, [Validators.required, Validators.min(1)]],
      imageUrl: [null, [Validators.required,this.PictureValidator()]],
    });



  }


 ngOnInit(): void {
   
 }


 onSubmit() {
  const userString = localStorage.getItem("user");
  const parsedUser = userString ? JSON.parse(userString) : null;
  const authorsList: string[] = parsedUser && parsedUser.name ? [parsedUser.name] : [];

  const book = {
    title: this.bookForm.value.title,
    description: this.bookForm.value.description,
    pageCount: this.bookForm.value.pageCount,
    publishedDate: new Date().toISOString(),
    authors: authorsList,
    imageUrl: this.bookForm.value.imageUrl
  };

  const apiUrl = `${environment.apiUrl}/books/create`;
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.getToken()}`
  });

  this.http.post(apiUrl, book, { headers, responseType: "json" }).subscribe(
    (response) => {
      Swal.fire({
        title: 'Success',
        text: "Book has been added successfully",
        icon: 'success',
        timer: 1500
      });
      this.bookForm.reset();
    },
    (error) => {
      Swal.fire({
        title: 'Error',
        text: "Something went wrong try again later",
        icon: 'error',
        timer: 1500
      });
    }
  );
 }

 private getToken() {
  
  return localStorage.getItem('token')

}
 onFileSelected(event: any) {

   if (event.target.files && event.target.files[0]) {
     var filesAmount = event.target.files.length;
     for (let i = 0; i < filesAmount; i++) {
       var reader = new FileReader();
       reader.onload = (event: any) => {
         if(event.target.result)
         {
         this.bookForm.get('imageUrl')?.setValue(event.target.result);
         }
       };
       reader.readAsDataURL(event.target.files[i]);
     }
   }

 } 
 PictureValidator()
{
 return (control:AbstractControl)=>
 {
   if (control.value) {
     const file: File = control.value;
 

     var size = file.size
    
       const fileSizeInMB = Math.round(size / 1024);
       if (fileSizeInMB < 1024)
       {
        
         return { fileSizeInvalid: true };
       
       }
      
     // Check file type (allowed types: .jpg, .jpeg, .png)
     // const allowedTypes = ['image.jpeg', 'image.jpg', 'image.png'];
     // if (!allowedTypes.includes(file.type)) {
     //   return { fileTypeInvalid: true };
     // }
   }
 
   return null;
 }
} 

resetForm()
{
 this.bookForm.reset()
}

}
