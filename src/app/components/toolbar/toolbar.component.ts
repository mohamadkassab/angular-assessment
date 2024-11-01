import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu'; // Import MatMenuModule
import { CommonModule } from '@angular/common'; // Import CommonModule
import { WeatherComponent } from '../../weather/weather.component';
import { MyStoreComponent } from '../../my-store/my-store.component';
import { AuthService } from '../../services/auth/auth.service';
import { StateService } from '../../services/app-state/app-state.service';
import { initializeApp } from 'firebase/app';
import { environment } from '../../../environments/environment.dev';


const app = initializeApp(environment.firebase);


@Component({
  selector: 'toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.css'],
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, CommonModule],
})
export class ToolbarBasic implements OnInit {
  currentComponent: any;
  currentPage = "Weather";

  constructor(private authService: AuthService, private stateService: StateService) {
    this.currentComponent = WeatherComponent;
  }
  ngOnInit(): void {
    this.stateService.currentPage$.subscribe(value => {
      this.currentPage = value;
    })
  }

  loadComponent(option: string) {
    if (option === 'Weather') {
      this.currentComponent = WeatherComponent;
    } else if (option === 'MyStore') {
      this.currentComponent = MyStoreComponent;
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
