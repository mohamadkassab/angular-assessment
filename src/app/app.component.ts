import { Component, computed, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from "./components/loading/loading.component";
import { CommonModule } from '@angular/common';
import { SignalService } from './services/signal/signal.service';
import { OnInit } from '@angular/core';
import { StatusModel } from './models/status.model';
import { ErrorComponent } from "./components/error/error.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent, CommonModule, ErrorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  ngOnInit() {
    
  }

  title = 'angular-assessment';
  currentPage: string = "";
  isLoading: boolean = false;
  errorMessages: string[] = [];

  constructor(private signalService: SignalService) {
    effect(() => {
      if (this.signalService._status() === StatusModel.LOADING) {
        this.isLoading = true;
      } else {
        this.isLoading = false;
      }
    });

    effect(() => {
      this.currentPage = this.signalService._currentPage();
    });

    effect(() => {
      const currentError = this.signalService._errorMessages();
      if (currentError.length > 0) {
        const errorMessage = this.signalService.popErrorMessage();
        if(errorMessage != undefined){
          this.errorMessages.push(errorMessage);
          setTimeout(() => this.dismissError(errorMessage), 5000);
        }
      }
    }, { allowSignalWrites: true });
  }

  dismissError(errorMessage: string) {
    this.errorMessages = this.errorMessages.filter(error => error !== errorMessage);
  }
}
