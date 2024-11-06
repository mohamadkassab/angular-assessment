import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map, timeout } from 'rxjs';
import { TIMEOUT_DURATION, TOKEN_KEY } from '../../utils/constants';
import { environment } from '../../../environments/environment.dev';
import { SignalService } from '../signal/signal.service';
import { StatusModel } from '../../models/status.model';

@Injectable({
  providedIn: 'root'
})

export class WeatherService {
  private baseUrl = environment.urls.weatherApiUrl;

  constructor(private http: HttpClient, private signalService: SignalService) { }

  getWeather(lat: number, lon: number): Observable<any> {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const options = {
      headers:{
        'Authorization': `Bearer ${token}`,
      },
      params: {
        latitude: lat.toString(),
        longitude: lon.toString(),
        current_weather: 'true'
      }
    }

    
    return this.http.get(this.baseUrl, options).pipe(
      timeout(TIMEOUT_DURATION), 
      catchError(e => {
        console.error('Error fetching weather data', e);
        return of(null); 
      })
    );
  }

  getWeatherForMultipleCountries(countries: { lat: number; lon: number; name: string }[]): void {
    this.signalService.updateStatus$(StatusModel.LOADING);
    const weatherData: any[] = [];
    let completedRequests = 0;
  
    countries.forEach((country, index) => {
      this.getWeather(country.lat, country.lon).subscribe(
        data => {

          if(index === 10 || index === 11){
            this.signalService.pushErrorMessage(`Error fetching weather for ${country.name}`);
          }
          
          if (data) {
            data.countryName = country.name;
            weatherData.push(data);
          }
          completedRequests++;
          if (completedRequests === countries.length) {
            this.signalService.updateWeatherData$(weatherData);
            this.signalService.updateStatus$(StatusModel.IDLE);  
          }
        },
        error => {
          console.error(`Error fetching weather for ${country.name}:`, error);
          completedRequests++;
          this.signalService.pushErrorMessage(`Error fetching weather for ${country.name}`);
          if (completedRequests === countries.length) {
            this.signalService.updateWeatherData$(weatherData);
            this.signalService.updateStatus$(StatusModel.IDLE);  
          }
        }
      );
    });
}
}
