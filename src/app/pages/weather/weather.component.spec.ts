import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherComponent } from './weather.component';
import { WeatherCardComponent } from '../../components/weather-card/weather-card.component';
import { WeatherService } from '../../services/weather/weather.service';
import { SignalService } from '../../services/signal/signal.service';
import { PagesModel } from '../../models/pages.model';

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;
  let mockWeatherService: jasmine.SpyObj<WeatherService>;
  let mockSignalService: jasmine.SpyObj<SignalService>;

  beforeEach(() => {
    mockWeatherService = jasmine.createSpyObj('WeatherService', ['getWeatherForMultipleCountries']);
    mockSignalService = jasmine.createSpyObj('SignalService', ['_weatherData', 'updateCurrentPage$']);
    mockSignalService._weatherData.and.returnValue([{ lat: 50.8503, lon: 4.3517, name: 'Brussels' }]);
    mockSignalService.updateCurrentPage$.and.returnValue(undefined);
    
    TestBed.configureTestingModule({
      imports: [WeatherComponent, WeatherCardComponent],
      providers: [
        { provide: WeatherService, useValue: mockWeatherService },
        { provide: SignalService, useValue: mockSignalService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create the WeatherComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateCurrentPage$ on ngOnInit', () => {
    component.ngOnInit();
    expect(mockSignalService.updateCurrentPage$).toHaveBeenCalledWith(PagesModel.WEATHER);
  });
});
