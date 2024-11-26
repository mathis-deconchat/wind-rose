import { Component, Input } from '@angular/core';
import { WindData } from './wind.service';

@Component({
  selector: 'app-data-modal',
  standalone: true,
  templateUrl: './data-modal.component.html'
})
export class DataModalComponent {
  @Input() windData: WindData[] = [];
  @Input() isOpen: boolean = false;
  @Input() onClose: () => void = () => {};

  close() {
    this.onClose();
  }
}