import { Injectable } from '@angular/core';
import { User } from '../components/navbar/navbar.component';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class ReadingListService {

  constructor(private http:HttpClient) { }


  storedUser:any = localStorage.getItem('user');
  user:User= this.storedUser ? JSON.parse(this.storedUser) : null;

  readingList: any = this.getReadingList();
  
  getToken(){
    
    return localStorage.getItem('token')
  
}

  getReadingList()
  {
    const id = this.user?.id;
    const apiUrl = `${environment.apiUrl}/reading-lists/${id}`;
    const token = localStorage.getItem('token');
    
    const headers= new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    })    
   return this.http.get(apiUrl, {headers});
     
      }
  addBookToReadingList(bookId:string)
  {
    const id = this.user.id;
  const apiUrl = `${environment.apiUrl}/reading-lists/${id}/${bookId}`;
  const token = localStorage.getItem('token');
  
  const headers= new HttpHeaders({
    'Authorization': `Bearer ${this.getToken()}`
  })    
  this.http.post(apiUrl,null, {headers}).subscribe(
    (response) => {
      
     Swal.fire({ 
      title: 'Success',
     text: "Book has been added to the reading list.",
     icon: 'success',
     timer: 1500})
    },
    (error) => {
      Swal.fire({ 
        title: 'error',
       text: error.message,
       icon: 'error',
       timer: 1500})
    }
  );
  }


  

  removeFromReadingList(bookId:number)
  {
    console.log(bookId)
  const apiUrl = `${environment.apiUrl}/reading-lists/${bookId}`;
  const token = localStorage.getItem('token');
  console.log(token)
  const headers= new HttpHeaders({
    'Authorization': `Bearer ${this.getToken()}`
  })    
 return this.http.delete(apiUrl, {headers,responseType: "text"});
  }
}
