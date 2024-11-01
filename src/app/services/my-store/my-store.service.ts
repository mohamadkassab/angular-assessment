import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, timeout, catchError } from 'rxjs';
import { ProductModel } from '../../models/product.model';
import { TIMEOUT_DURATION } from '../../utils/constants';
import { environment } from '../../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})

export class MyStoreService {
  private baseUrl = environment.urls.fakeStoreApiUrl;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(this.baseUrl).pipe(
      timeout(TIMEOUT_DURATION), 
      catchError(error => {
        console.error('Error fetching products', error);
        return throwError(() => new Error('Failed to fetch products; please try again later.'));
      })
    );
  }
}
