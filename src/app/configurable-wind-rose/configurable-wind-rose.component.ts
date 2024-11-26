import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { FormsModule } from '@angular/forms';
import type { EChartsOption } from 'echarts';
import { WindService, WindData } from '../wind.service';

interface Control {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
}

@Component({
  selector: 'app-configurable-wind-rose',
  standalone: true,
  imports: [NgxEchartsModule, FormsModule],
  templateUrl: './configurable-wind-rose.component.html'
})
export class ConfigurableWindRoseComponent implements OnInit {
  @Output() pointsChange = new EventEmitter<number>();
  
  chartOption: EChartsOption = {};
  windData: WindData[] = [];
  
  controls: Control[] = [
    { id: 'points', label: 'Data Points', value: 36, min: 36, max: 720, unit: 'pts' },
    { id: 'speed', label: 'Max Speed', value: 50, min: 20, max: 200, unit: 'km/h' },
    { id: 'radius', label: 'Chart Size', value: 70, min: 50, max: 90, unit: '%' },
    { id: 'divisions', label: 'Speed Rings', value: 4, min: 2, max: 8, unit: '' }
  ];

  constructor(private windService: WindService) {}

  ngOnInit() {
    this.updateChart();
  }

  getControlValue(id: string): number {
    return this.controls.find(c => c.id === id)?.value || 0;
  }

  private formatDirectionLabel(angle: number): string {
    if (angle === 0) return 'N (0°)';
    if (angle === 90) return 'E (90°)';
    if (angle === 180) return 'S (180°)';
    if (angle === 270) return 'W (270°)';
    return `${angle}°`;
  }

  updateChart() {
    const numberOfPoints = this.getControlValue('points');
    const maxSpeed = this.getControlValue('speed');
    const chartRadius = this.getControlValue('radius');
    const splitNumber = this.getControlValue('divisions');

    this.pointsChange.emit(numberOfPoints);
    this.windData = this.windService.getWindData(numberOfPoints);

    // Always use 36 indicators (10° steps)
    const indicators = Array.from({ length: 36 }, (_, i) => ({
      name: this.formatDirectionLabel(i * 10),
      max: maxSpeed
    }));

    const data = this.processWindData(this.windData);

    this.chartOption = {
      backgroundColor: 'transparent',
      radar: {
        shape: 'circle',
        indicator: indicators,
        center: ['50%', '50%'],
        radius: `${chartRadius}%`,
        startAngle: 90,
        splitNumber: splitNumber,
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

  private processWindData(windData: WindData[]): number[] {
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