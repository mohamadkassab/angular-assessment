import { TestBed } from '@angular/core/testing';
import { MyStoreService } from './my-store.service';
import { SignalService } from '../signal/signal.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ProductModel } from '../../models/product.model';
import { StatusModel } from '../../models/status.model';
import { environment } from '../../../environments/environment.dev';

class MockSignalService {
  updateStatus$ = jasmine.createSpy('updateStatus$');
  updateMyStoreData$ = jasmine.createSpy('updateMyStoreData$');
  pushErrorMessage = jasmine.createSpy('pushErrorMessage');
}

describe('MyStoreService', () => {
  let myStoreService: MyStoreService;
  let signalService: SignalService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        MyStoreService,
        { provide: SignalService, useClass: MockSignalService }
      ]
    });

    myStoreService = TestBed.inject(MyStoreService);
    signalService = TestBed.inject(SignalService);
    httpClient = TestBed.inject(HttpClient);

    // Mocking sessionStorage.getItem
    spyOn(sessionStorage, 'getItem').and.returnValue('fake-token');
  });

  describe('getProducts', () => {
    it('should fetch products successfully and update status', () => {
      const mockProducts: ProductModel[] = [{ id: 1, title: 'Product 1', price: 100, description:"des", category:"cat", image:"image" }];
      spyOn(httpClient, 'get').and.returnValue(of(mockProducts));
      myStoreService.getProducts();
      expect(signalService.updateStatus$).toHaveBeenCalledWith(StatusModel.LOADING);
      expect(httpClient.get).toHaveBeenCalledWith(environment.urls.fakeStoreApiUrl, {
        headers: { 'Authorization': 'Bearer fake-token' }
      });
      expect(signalService.updateStatus$).toHaveBeenCalledWith(StatusModel.IDLE);
      expect(signalService.updateMyStoreData$).toHaveBeenCalledWith(mockProducts);
    });

    it('should handle error when fetching products', () => {
      spyOn(httpClient, 'get').and.returnValue(throwError(() => new Error('Error fetching products')));
      myStoreService.getProducts();
      expect(signalService.updateStatus$).toHaveBeenCalledWith(StatusModel.LOADING);
      expect(signalService.updateStatus$).toHaveBeenCalledWith(StatusModel.IDLE);
      expect(signalService.pushErrorMessage).toHaveBeenCalledWith("Error fetching My Store products");
    });

    it('should handle timeout error during the request', () => {
      spyOn(httpClient, 'get').and.returnValue(throwError(() => new Error('Timeout exceeded')));
      myStoreService.getProducts();
      expect(signalService.updateStatus$).toHaveBeenCalledWith(StatusModel.LOADING);
      expect(signalService.updateStatus$).toHaveBeenCalledWith(StatusModel.IDLE);
      expect(signalService.pushErrorMessage).toHaveBeenCalledWith("Error fetching My Store products");
    });
  });
});
