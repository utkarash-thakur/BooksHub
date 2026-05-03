import { Component, OnInit } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-discussions',
  templateUrl: './discussions.component.html',
  styleUrls: ['./discussions.component.css']
})
export class DiscussionsComponent implements OnInit {



  discussions: any[] = [];
  selectedDiscussion: any = null;
  discussionId:any=null;
  newComment: string = '';
  showSidebar: boolean = true;

  constructor(private http: HttpClient,
  private router:Router,
  private datePipe:DatePipe) {}

  ngOnInit(): void {
    this.fetchDiscussions();
  }

  fetchDiscussions() {
    const apiUrl = `${environment.apiUrl}/discussion/getall`;
 
    const token = localStorage.getItem('token');
    this.http.get<any[]>(apiUrl).subscribe(
      (response) => {
        this.discussions = response;
      },
      (error) => {
        console.error("Error fetching discussions", error);
      }
    );
  }

 
  formatDate(dateTime: number[]) {
    const [year, month, day, hours, minutes, seconds, milliseconds] = dateTime;
    const dateObject = new Date(year, month - 1, day, hours, minutes, seconds, milliseconds);
    return this.datePipe.transform(dateObject, 'medium');
  }
  

   selectDiscussionById(id:number)
   {
    const apiUrl = `${environment.apiUrl}/discussion/${id}`;
    const token = localStorage.getItem('token');
    
    const headers= new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    })  
    this.http.get(apiUrl, {headers}).subscribe(
      (response) => {
        
        this.selectedDiscussion = response;
        this.discussionId = id;
      },
      (error) => {
        console.error("Error fetching discussions", error);
      }
    );
      
   }



  addComment() {
    const userString = localStorage.getItem('user');
    
    if (!userString) {
    
      Swal.fire({
        title: 'Error',
        text: "User has to login.",
        icon: 'error',
        timer: 1500
      })
      // Redirect to the login page or handle unauthorized access as needed
      this.router.navigate(['/login']);
      return;
    }
  
    const userObject = JSON.parse(userString);
    const userId = userObject.id;
    
    const apiUrl = `${environment.apiUrl}/discussion/addMessage/${this.discussionId}?content=${this.newComment}&UserId=${userId}`;
    const token = localStorage.getItem('token');
  
    if (!token) {
      Swal.fire({
        title: 'Error',
        text: "User is not logged in.",
        icon: 'error',
        timer: 1500
      })
      
      this.router.navigate(['/login']);
      return;
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    this.http.post(apiUrl, null, { headers, responseType: "text" }).subscribe(
      (response) => {
        Swal.fire({
          title: 'Success',
          text: "Comment added successfully.",
          icon: 'success',
          timer: 1500
        })
        // Handle the response as needed
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: "Error Adding comment try again later.",
          icon: 'error',
          timer: 1500
        })
      }
    );
  
    // Reset the newComment variable after successfully adding the comment
    this.newComment = '';
    this.selectDiscussionById(this.discussionId);
  }
  

    createNewDiscussion(title:string)
    {
    const apiUrl = `${environment.apiUrl}/discussion/create?title=${title}`;
    const token = localStorage.getItem('token');
    
    const headers= new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    })  
    this.http.post(apiUrl,null, {headers, responseType:"text"}).subscribe(
      (response) => {
        Swal.fire({
          title: 'Success',
          text: "Discussion has been started successfully.",
          icon: 'success',
          timer: 1500
        })
        this.fetchDiscussions();
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: "Error Adding comment try again later.",
          icon: 'error',
          timer: 1500
      }) 
    }
    );

    const closeButton = document.querySelector('[data-modal-hide="authentication-modal"]');
    if (closeButton) {
        closeButton.dispatchEvent(new Event('click'));
    }
      
    }

    getToken(){
    
      return localStorage.getItem('token')
    
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }



//discussion form



  discussionTitle: string = '';

  onFormSubmit() {


    this.createNewDiscussion(this.discussionTitle);
    
   
   this.discussionTitle="";
  }

 

  
}