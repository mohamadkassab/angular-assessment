import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { TOKEN_NAME } from '../utils/constants';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { ToolbarBasic } from '../components/toolbar/toolbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ToolbarBasic, ToolbarBasic],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {

}
