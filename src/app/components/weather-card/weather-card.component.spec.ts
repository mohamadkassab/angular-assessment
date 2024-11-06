import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherCardComponent } from './weather-card.component';
import { CommonModule } from '@angular/common';

describe('WeatherCardComponent', () => {
  let component: WeatherCardComponent;
  let fixture: ComponentFixture<WeatherCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherCardComponent],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherCardComponent);
    component = fixture.componentInstance;
    component.weather = {
      countryName: 'Lebanon',
      timezone: 'EET',
      timezone_abbreviation: 'EET',
      elevation: 86,
      current_weather: {
        temperature: 25,
        windspeed: 10,
        winddirection: 180,
        time: new Date().toISOString(),
        is_day: true
      }
    }; // Provide default weather data here
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct weather details', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.weather-city-name').textContent).toContain('Lebanon');
    expect(compiled.querySelector('.weather-details .temp').textContent).toContain('25 °C');
    expect(compiled.querySelector('.weather-details .wind').textContent).toContain('10 km/h');
    expect(compiled.querySelector('.weather-details .direction').textContent).toContain('180°');
    const date = new Date(component.weather.current_weather.time);
    const options: any = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedTime = date.toLocaleTimeString([], options); 
    const expectedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(-2)}, ${formattedTime}`;
    expect(compiled.querySelector('.weather-details .time').textContent).toContain(expectedDate);
    expect(compiled.querySelector('.weather-details .day').textContent).toContain('Day');
  });
});
