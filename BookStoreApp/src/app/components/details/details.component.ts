import { Component,OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { ReadingListService } from 'src/app/services/reading-list.service';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  book:any={};
  newReviewComment: string = '';
  newReviewRating: number = 5;
  stars: number[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private http: HttpClient
    ,private datePipe:DatePipe,
    private service: ReadingListService) {}

      ngOnInit(): void {
       
        this.route.params.subscribe(params => {
          const bookId = params['id'];
          this.fetchBookDetails(bookId);
        });
        this.stars = Array(5).fill(0).map((_, i) => i + 1);
      }

fetchBookDetails(bookId: string): void {
  
  const apiUrl = `${environment.apiUrl}/books/${bookId}`;

  this.http.get<any>(apiUrl).subscribe(
    (response) => {
     
     this.book=response;
    },
    (error) => {
      console.error('Error fetching book details', error);
    }
  );
}

resetStars(): void {
  if (this.newReviewRating === 0) {
    this.newReviewRating = 0;
  }
}
highlightStars(index: number): void {
  this.newReviewRating = index + 1;
}

setNewRating(rating: number): void {
  this.newReviewRating = rating;
}

addReview(): void {
  const apiUrl = `${environment.apiUrl}/review/${this.book.id}`;

  const token = localStorage.getItem('token');
  const userString = localStorage.getItem("user");
  if (!token || !userString) {
    this.router.navigate(['/login']);
    return;
  }

  

  const userObject = JSON.parse(userString);
  const userId = userObject.id;

  const newReview = new HttpParams()
    .set("review", this.newReviewComment)
    .set('rating', this.newReviewRating.toString()) // Assuming rating is expected as a string
    .set('userId', userId.toString());

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  this.http.post(apiUrl, newReview, { headers }).subscribe(
    (response) => {
      this.fetchBookDetails(this.book.id);
      this.newReviewComment = '';
      this.newReviewRating = 5;
      Swal.fire({
        title: 'Success',
        text: "Review has been added successfully",
        icon: 'success',
        timer: 1500
      })
    },
    (error) => {
      Swal.fire({
        title: 'Error',
        text: "Please try again later",
        icon: 'error',
        timer: 1500
      })
    }
  );
}

addToReadingList(bookId:string)
{
  this.service.addBookToReadingList(bookId);
}



formatDate(dateArray: number[]) {
  const [year, month, day] = dateArray;
  const dateObject = new Date(year, month - 1, day);
  return this.datePipe.transform(dateObject, 'mediumDate');
}

nameI(name:string)
{
  return name.split(" ").map(word=>  word.charAt(0).toUpperCase()).join("");
}

getAverageRating(reviews: any[]): number {
  if (!reviews || reviews.length === 0) {
    return 0; // or whatever default value you want for no reviews
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  // Round to 1 decimal place
  return Math.round(averageRating * 10) / 10;
}


}
