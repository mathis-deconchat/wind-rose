import { Injectable } from '@angular/core';

export interface WindData {
  angle: number;  // Angle in degrees (0-360, 0 = North, clockwise)
  speed: number;
}

@Injectable({
  providedIn: 'root'
})
export class WindService {
  getWindData(points: number = 36): WindData[] {
    return Array.from({ length: points }, (_, i) => {
      const angle = (i * (360 / points)) % 360;
      // Generate more realistic wind speeds 
      const baseSpeed = 5 + Math.random() * 40;

      return {
        angle,
        speed: Math.round(baseSpeed * 10) / 10
      };
    });
  }
}