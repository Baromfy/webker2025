import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { SeedDataService } from './services/seed-data.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'billiard-idopontfoglalo';
  
  constructor(private seedDataService: SeedDataService) {}
  
  ngOnInit() {
    this.seedDataService.initializeDatabase()
      .then(() => {
      })
      .catch(error => {
      });
  }
}
