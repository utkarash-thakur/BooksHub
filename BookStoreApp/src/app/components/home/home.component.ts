import { Component , OnInit} from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import  Swal  from "sweetalert2";
import { ReadingListService } from 'src/app/services/reading-list.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  books: any[] =[];
  currentPage: number = 1;
  pages: number[] = [1, 2, 3, 4, 5,6,7,8,9];

  

  constructor(
    private http:HttpClient,
    private router :Router,
    private service:ReadingListService,
    
  ){}


 ngOnInit(): void {
   this.fetchBooks();
 }

 fetchBooks() {
  const apiUrl = `${environment.apiUrl}/books?page=${this.currentPage}`;

  this.http.get<any>(apiUrl).subscribe
  (
    (response) =>
    {
      this.books = response;
    },
    (error)=>
    {
      console.error("Error fetching books", error);
    }
  )

 }
 changePage(page: number | string): void {
  if (page === 'prev' && this.currentPage > 1) {
    this.currentPage--;
  } else if (page === 'next' && this.currentPage < 10) {
    this.currentPage++;
  } else if (typeof page === 'number' && page >= 1 && page <= 10) {
    this.currentPage = page;
  }

  // After updating the current page, fetch books for the new page
  this.fetchBooks();
}

viewDetails(bookId:string):void{

  this.router.navigate(["./book-details",bookId])
}

addToReadingList(bookId:string)
{
   this.service.addBookToReadingList(bookId);
}




 

}
