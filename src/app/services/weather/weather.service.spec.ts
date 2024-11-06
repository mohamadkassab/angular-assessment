import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WeatherService } from './weather.service';
import { SignalService } from '../signal/signal.service';
import { StatusModel } from '../../models/status.model';
import { environment } from '../../../environments/environment.dev';
import { TOKEN_KEY } from '../../utils/constants';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;
  let signalService: SignalService;

  beforeEach(() => {
    signalService = jasmine.createSpyObj('SignalService', ['updateStatus$', 'pushErrorMessage', 'updateWeatherData$']);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WeatherService,
        { provide: SignalService, useValue: signalService }
      ]
    });
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch weather data', () => {
    const mockWeatherData = { temperature: 20 };
    const token = 'mockToken';
    sessionStorage.setItem(TOKEN_KEY, token);
    
    service.getWeather(35, 139).subscribe(data => {
      expect(data).toEqual(mockWeatherData);
    });

    const req = httpMock.expectOne(`${environment.urls.weatherApiUrl}?latitude=35&longitude=139&current_weather=true`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush(mockWeatherData);
  });

  it('should handle error when fetching weather data', () => {
    sessionStorage.setItem(TOKEN_KEY, 'mockToken');
    service.getWeather(35, 139).subscribe(data => {
      expect(data).toBeNull();
    });
    const req = httpMock.expectOne(`${environment.urls.weatherApiUrl}?latitude=35&longitude=139&current_weather=true`);
    req.error(new ErrorEvent('Network error'));
  });

  it('should update weather data for multiple countries', () => {
    const countries = [
      { lat: 35, lon: 139, name: 'Japan' },
      { lat: 51, lon: -0.1, name: 'UK' }
    ];
    const mockWeatherData = [
      { temperature: 20, countryName: 'Japan' },
      { temperature: 15, countryName: 'UK' }
    ];

    service.getWeatherForMultipleCountries(countries);
    countries.forEach((country, index) => {
      const req = httpMock.expectOne(`${environment.urls.weatherApiUrl}?latitude=${country.lat}&longitude=${country.lon}&current_weather=true`);
      expect(req.request.method).toBe('GET');
      req.flush({ temperature: mockWeatherData[index].temperature });
    });

    expect(signalService.updateStatus$).toHaveBeenCalledWith(StatusModel.LOADING);
    expect(signalService.updateWeatherData$).toHaveBeenCalledWith(mockWeatherData);
    expect(signalService.updateStatus$).toHaveBeenCalledWith(StatusModel.IDLE);
  });
});
