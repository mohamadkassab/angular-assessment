import { Component, effect } from '@angular/core';
import { WeatherService } from '../../services/weather/weather.service';
import { CommonModule } from '@angular/common';
import { WeatherCardComponent } from '../../components/weather-card/weather-card.component';
import { SignalService } from '../../services/signal/signal.service';
import { StatusModel } from '../../models/status.model';
import { PagesModel } from '../../models/pages.model';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, WeatherCardComponent],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'] 
})
export class WeatherComponent {
  weatherData: any[] = []; 

  constructor(private weatherService: WeatherService, private signalService: SignalService) {
    effect(() => {
      const _weatherData = this.signalService._weatherData();
      if (_weatherData.length > 0) {
        this.weatherData = _weatherData;
      }
    });
   }

  ngOnInit(): void {
    this.signalService.updateCurrentPage$(PagesModel.WEATHER);
    const countries = [
      { lat: 50.8503, lon: 4.3517, name: "Brussels" }, // Brussels, Belgium
      { lat: 48.8566, lon: 2.3522, name: "Paris" }, // Paris, France
      { lat: 51.5074, lon: -0.1278, name: "London" }, // London, UK
      { lat: 40.7128, lon: -74.0060, name: "New York" }, // New York, USA
      { lat: 35.6895, lon: 139.6917, name: "Tokyo" },     // Tokyo, Japan
      { lat: -33.8688, lon: 151.2093, name: "Sydney" },   // Sydney, Australia
      { lat: 55.7558, lon: 37.6176, name: "Moscow" },     // Moscow, Russia
      { lat: 19.4326, lon: -99.1332, name: "Mexico City" }, // Mexico City, Mexico
      { lat: -23.5505, lon: -46.6333, name: "São Paulo" }, // São Paulo, Brazil
      { lat: 28.6139, lon: 77.2090, name: "New Delhi" },  // New Delhi, India
      { lat: 1.3521, lon: 103.8198, name: "Singapore" },  // Singapore, Singapore
      { lat: -1.2921, lon: 36.8219, name: "Nairobi" }    // Nairobi, Kenya
    ];

    this.weatherService.getWeatherForMultipleCountries(countries);
  }
}
