import { Component} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu'; // Import MatMenuModule
import { CommonModule } from '@angular/common'; // Import CommonModule
import { WeatherComponent } from '../../weather/weather.component';
import { MyStoreComponent } from '../../my-store/my-store.component';


@Component({
  selector: 'toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.css'],
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, CommonModule],
})
export class ToolbarBasic {
  currentComponent: any; 

  constructor() {
    this.currentComponent = MyStoreComponent; 
  }

  loadComponent(option: string) {
    if (option === 'Weather') {
      this.currentComponent = WeatherComponent; 
    } else if (option === 'MyStore') {
      this.currentComponent = MyStoreComponent; 
    }
  }

  signOut() {
    
  }
}
