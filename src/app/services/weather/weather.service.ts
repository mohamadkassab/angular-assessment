import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


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
    return this.http.get(this.baseUrl, { params });
  }

  getWeatherForMultipleCountries(countries: { lat: number; lon: number; name: string }[]): Observable<any[]> {
    return new Observable(observer => {
      const weatherData: any[] = [];
      let completedRequests = 0;
  
      countries.forEach(country => {
        this.getWeather(country.lat, country.lon).subscribe(data => {
          data.countryName = country.name;
          weatherData.push(data);
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
