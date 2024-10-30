import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather-card',
  templateUrl: './weather-card.component.html',
  styleUrls: ['./weather-card.component.css'],
  standalone: true, 
  imports: [CommonModule]
})
export class WeatherCardComponent {
  @Input() weather: any; 
}
