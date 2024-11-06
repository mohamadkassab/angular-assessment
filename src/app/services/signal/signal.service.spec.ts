import { TestBed } from '@angular/core/testing';
import { SignalService } from './signal.service';
import { StatusModel } from '../../models/status.model';
import { PagesModel } from '../../models/pages.model';
import { ProductModel } from '../../models/product.model';

describe('SignalService', () => {
  let signalService: SignalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignalService],
    });

    signalService = TestBed.inject(SignalService);
  });

  describe('updateStatus$', () => {
    it('should update the status signal', () => {
      signalService.updateStatus$(StatusModel.LOADING);
      expect(signalService._status()).toBe(StatusModel.LOADING);
    });
  });

  describe('pushErrorMessage', () => {
    it('should add an error message to the errorMessages signal', () => {
      const message = 'Something went wrong';
      signalService.pushErrorMessage(message);
      expect(signalService._errorMessages()).toContain(message);
    });

    it('should add multiple error messages to the errorMessages signal', () => {
      const message1 = 'First error';
      const message2 = 'Second error';

      signalService.pushErrorMessage(message1);
      signalService.pushErrorMessage(message2);

      const messages = signalService._errorMessages();
      expect(messages).toContain(message1);
      expect(messages).toContain(message2);
    });
  });

  describe('popErrorMessage', () => {
    it('should pop the first error message', () => {
      const message1 = 'First error';
      const message2 = 'Second error';
      
      signalService.pushErrorMessage(message1);
      signalService.pushErrorMessage(message2);
      const poppedMessage = signalService.popErrorMessage();

      expect(poppedMessage).toBe(message1);
      expect(signalService._errorMessages()).not.toContain(message1);
      expect(signalService._errorMessages()).toContain(message2);
    });

    it('should return undefined when no error messages are present', () => {
      const poppedMessage = signalService.popErrorMessage();
      expect(poppedMessage).toBeUndefined();
    });
  });

  describe('updateCurrentPage$', () => {
    it('should update the current page signal', () => {
      const newPage = PagesModel.WEATHER;
      signalService.updateCurrentPage$(newPage);
      expect(signalService._currentPage()).toBe(newPage);
    });
  });

  describe('updateEmail$', () => {
    it('should update the email signal', () => {
      const email = 'user@example.com';
      signalService.updateEmail$(email);
      expect(signalService._email()).toBe(email);
    });

    it('should update the email signal to null', () => {
      signalService.updateEmail$(null);
      expect(signalService._email()).toBeNull();
    });
  });

  describe('updateIsAuthenticated$', () => {
    it('should update the isAuthenticated signal to true', () => {
      signalService.updateIsAuthenticated$(true);
      expect(signalService._isAuthenticated()).toBe(true);
    });

    it('should update the isAuthenticated signal to false', () => {
      signalService.updateIsAuthenticated$(false);
      expect(signalService._isAuthenticated()).toBe(false);
    });
  });

  describe('updateWeatherData$', () => {
    it('should update the weatherData signal with an array of data', () => {
      const weatherData = [{ temp: 25, condition: 'Clear' }];
      signalService.updateWeatherData$(weatherData);
      expect(signalService._weatherData()).toEqual(weatherData);
    });
  });

  describe('updateMyStoreData$', () => {
    it('should update the myStoreData signal with an array of products', () => {
      const products: ProductModel[] = [
        { id: 1, title: 'Product 1', price: 100, description:"des", category:"cat", image:"image" },
        { id: 2, title: 'Product 2', price: 100, description:"des", category:"cat", image:"image" }
      ];
      signalService.updateMyStoreData$(products);
      expect(signalService._myStoreData()).toEqual(products);
    });
  });
});
