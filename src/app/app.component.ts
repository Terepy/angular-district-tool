import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DistrictMapComponent } from "./district-map/district-map.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DistrictMapComponent, DistrictMapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'district-tool';
}
