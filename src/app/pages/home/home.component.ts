import { Component} from '@angular/core';
import { ToolbarBasic } from '../../components/toolbar/toolbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ToolbarBasic, ToolbarBasic],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {

}
