import { Component } from '@angular/core';
import { WindRoseComponent } from './wind-rose.component';
import { ConfigurableWindRoseComponent } from './configurable-wind-rose.component';
import { DataModalComponent } from './data-modal.component';
import { WindService, WindData } from './wind.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WindRoseComponent, ConfigurableWindRoseComponent, DataModalComponent],
  templateUrl: './app.component.html'
})
export class App {
  isModalOpen = false;
  currentModalData: WindData[] = [];
  configurablePoints = 36;

  constructor(private windService: WindService) {}

  showReferenceData() {
    this.currentModalData = this.windService.getWindData(36);
    this.isModalOpen = true;
  }

  showConfigurableData() {
    this.currentModalData = this.windService.getWindData(this.configurablePoints);
    this.isModalOpen = true;
  }

  closeModal = () => {
    this.isModalOpen = false;
    this.currentModalData = [];
  }

  onConfigurablePointsChange(points: number) {
    this.configurablePoints = points;
  }
}