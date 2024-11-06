import { Component, effect, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu'; // Import MatMenuModule
import { CommonModule } from '@angular/common'; // Import CommonModule
import { WeatherComponent } from '../../pages/weather/weather.component';
import { MyStoreComponent } from '../../pages/my-store/my-store.component';
import { AuthService } from '../../services/auth/auth.service';
import { SignalService } from '../../services/signal/signal.service';
import { initializeApp } from 'firebase/app';
import { environment } from '../../../environments/environment.dev';
import { PagesModel } from '../../models/pages.model';

const app = initializeApp(environment.firebase);


@Component({
  selector: 'toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.css'],
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, CommonModule],
})
export class ToolbarBasic  {
  currentComponent: any;
  currentPage = "";

  constructor(private authService: AuthService, private signalService: SignalService) {

    effect(() => {
      const currentPage = this.signalService._currentPage();
      if (currentPage === PagesModel.WEATHER) {
        this.currentComponent = WeatherComponent;
        this.currentPage = PagesModel.WEATHER;
      } else if (currentPage === PagesModel.MyStore) {
        this.currentComponent = MyStoreComponent;
        this.currentPage = PagesModel.MyStore;
      }
    });
  }


  loadComponent(option: string) {
    if (option === PagesModel.WEATHER) {
      this.signalService.updateCurrentPage$(PagesModel.WEATHER);
    } else if (option === PagesModel.MyStore) {
      this.signalService.updateCurrentPage$(PagesModel.MyStore);
    }
  }

  async signOut() {
    try {
      await this.authService.signOut();
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  }
}
