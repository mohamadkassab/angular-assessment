import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map, timeout } from 'rxjs';
import { TIMEOUT_DURATION } from '../../utils/constants';

@Injectable({
  providedIn: 'root'
})

export class WeatherService {
  private baseUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor(private http: HttpClient) { }

  getWeather(lat: number, lon: number): Observable<any> {
    const params = {
      latitude: lat.toString(),
      longitude: lon.toString(),
      current_weather: 'true'
    };
    
    return this.http.get(this.baseUrl, { params }).pipe(
      timeout(TIMEOUT_DURATION), 
      catchError(e => {
        console.error('Error fetching weather data', e);
        return of(null); 
      })
    );
  }

  getWeatherForMultipleCountries(countries: { lat: number; lon: number; name: string }[]): Observable<any[]> {
    return new Observable(observer => {
      const weatherData: any[] = [];
      let completedRequests = 0;

      countries.forEach(country => {
        this.getWeather(country.lat, country.lon).subscribe(data => {
          if (data) {
            data.countryName = country.name;
            weatherData.push(data);
          } else {
            console.warn(`No data returned for ${country.name}`);
          }
          completedRequests++;
          if (completedRequests === countries.length) {
            observer.next(weatherData);
            observer.complete();
          }
        }, error => {
          console.error(`Error fetching weather for ${country.name}:`, error);
          completedRequests++;
          if (completedRequests === countries.length) {
            observer.next(weatherData);
            observer.complete();
          }
        });
      });
    });
  }
}
