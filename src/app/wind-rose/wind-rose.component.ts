import { Component, OnInit } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import { WindService } from '../wind.service';

@Component({
  selector: 'app-wind-rose',
  standalone: true,
  imports: [NgxEchartsModule],
  templateUrl: './wind-rose.component.html'
})
export class WindRoseComponent implements OnInit {
  chartOption: EChartsOption = {};

  constructor(private windService: WindService) {}

  ngOnInit() {
    const windData = this.windService.getWindData(36);
    const indicators = Array.from({ length: 36 }, (_, i) => ({
      name: this.formatDirectionLabel(i * 10),
      max: 50
    }));

    const data = this.processWindData(windData);

    this.chartOption = {
      backgroundColor: 'transparent',
      radar: {
        shape: 'circle',
        indicator: indicators,
        center: ['50%', '50%'],
        radius: '70%',
        startAngle: 90,
        splitNumber: 4,
        axisName: {
          color: '#999',
          fontSize: 12
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(50, 50, 50, 0.3)']
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(100, 100, 100, 0.3)'
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'rgba(100, 100, 100, 0.3)'
          }
        }
      },
      series: [{
        type: 'radar',
        symbol: 'none',
        data: [{
          value: data,
          name: 'Wind Speed',
          areaStyle: {
            color: 'rgba(255, 99, 71, 0.6)'
          },
          lineStyle: {
            color: 'rgba(255, 99, 71, 0.8)',
            width: 1
          }
        }]
      }]
    };
  }

  private formatDirectionLabel(angle: number): string {
    if (angle === 0) return 'N (0°)';
    if (angle === 90) return 'E (90°)';
    if (angle === 180) return 'S (180°)';
    if (angle === 270) return 'W (270°)';
    return `${angle}°`;
  }

  private processWindData(windData: { angle: number; speed: number }[]): number[] {
    const sectors: number[][] = Array(36).fill(0).map(() => []);
    const sectorSize = 10;

    // Distribute wind data into sectors (clockwise from North)
    windData.forEach(point => {
      const sectorIndex = Math.floor(point.angle / sectorSize) % 36;
      sectors[sectorIndex].push(point.speed);
    });

    // Calculate average speed for each sector
    return sectors.map(sectorSpeeds => 
      sectorSpeeds.length > 0 
        ? sectorSpeeds.reduce((sum, speed) => sum + speed, 0) / sectorSpeeds.length 
        : 0
    );
  }
}