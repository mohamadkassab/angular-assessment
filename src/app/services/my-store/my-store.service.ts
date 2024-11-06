import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, timeout } from 'rxjs';
import { ProductModel } from '../../models/product.model';
import { TIMEOUT_DURATION, TOKEN_KEY } from '../../utils/constants';
import { environment } from '../../../environments/environment.dev';
import { SignalService } from '../signal/signal.service';
import { StatusModel } from '../../models/status.model';

@Injectable({
  providedIn: 'root'
})
export class MyStoreService {
  private baseUrl = environment.urls.fakeStoreApiUrl;

  constructor(private http: HttpClient, private signalService: SignalService) { }

  getProducts(): void {
    this.signalService.updateStatus$(StatusModel.LOADING); 
    const token = sessionStorage.getItem(TOKEN_KEY);
    const options = {
      headers:{
        'Authorization': `Bearer ${token}`,
      },
    }

    this.http.get<ProductModel[]>(this.baseUrl, options).pipe(
      timeout(TIMEOUT_DURATION),

      finalize(() => {
        this.signalService.updateStatus$(StatusModel.IDLE); 
      })
    ).subscribe({
      next: (data) => {
        if (data) {
          this.signalService.updateMyStoreData$(data);
        }
      },
      error: (error) => {
        this.signalService.pushErrorMessage("Error fetching My Store products");
      }
    });
  }
}
