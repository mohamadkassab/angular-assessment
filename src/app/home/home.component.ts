import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { TOKEN_NAME } from '../utils/constants';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';  // Import for platform detection

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {}

  ngOnInit() {
   
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(TOKEN_NAME);
      if (!token) {
        this.router.navigate(['']);
        return;
      }

      try {
        const decoded: any = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now(); 
        if (isExpired) {
          this.router.navigate(['']);
        }
      } catch (error) {
        this.router.navigate(['/login']);
      }
    }
  }
}
