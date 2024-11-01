import { Component, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from "./components/loading/loading.component";
import { CommonModule } from '@angular/common';
import { StateService } from './services/app-state/app-state.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  title = 'angular-assessment';
  isLoading : boolean = false;
  currentPage  = "Weather";

  constructor(private stateService: StateService) {}

  ngOnInit(): void {
    this.stateService.status$.subscribe(value =>{
      if(value === "loading"){
        this.isLoading = true;
      }
      else{
        this.isLoading = false;
      }
    })

    this.stateService.currentPage$.subscribe(value =>{
      this.currentPage = value;
    })
  }
}
