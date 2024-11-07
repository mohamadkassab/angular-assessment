import { Injectable, signal, WritableSignal } from '@angular/core';
import { StatusModel } from '../../models/status.model';
import { PagesModel } from '../../models/pages.model';
import { ProductModel } from '../../models/product.model';

@Injectable({
  providedIn: 'root',
})

export class SignalService {

  public _status : WritableSignal<StatusModel> = signal(StatusModel.IDLE);
  updateStatus$(value: StatusModel) {
    this._status.set(value);
  }

  public _errorMessages: WritableSignal<string[]> = signal([]);
  
  pushErrorMessage(message: string): void {
    this._errorMessages.update(errors => [...errors, message]);
  }
  popErrorMessage(): string | undefined {
    let removedMessage: string | undefined;
    this._errorMessages.update(errors => {
      if (errors.length > 0) {
        removedMessage = errors[0];
        return errors.slice(1);
      }
      return errors;
    });
    return removedMessage;
  }

  public _currentPage: WritableSignal<string> = signal(PagesModel.WEATHER);
  updateCurrentPage$(value: string) {
    this._currentPage.set(value);
  }

  public _email: WritableSignal<string | null> = signal(null);
  updateEmail$(value: string | null) {
    this._email.set(value);
  }

  public _role: WritableSignal<string | null> = signal(null);
  updateRole$(value: string | null) {
    this._role.set(value);
  }

  public _isAuthenticated: WritableSignal<boolean> = signal(false);
  updateIsAuthenticated$(value: boolean) {
    this._isAuthenticated.set(value);
  }

  public _weatherData: WritableSignal<any[]> = signal([]);
  updateWeatherData$(value: any[]) {
    this._weatherData.set(value);
  }

  public _myStoreData: WritableSignal<any[]> = signal([]);
  updateMyStoreData$(value: ProductModel[]) {
    this._myStoreData.set(value);
  }
}
