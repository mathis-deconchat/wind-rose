import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { FormsModule } from '@angular/forms';
import type { EChartsOption } from 'echarts';
import { WindService, WindData } from './wind.service';

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
    { id: 'indicators', label: 'Direction Sectors', value: 36, min: 8, max: 72, unit: 'sec' },
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

  formatDirectionLabel(angle: number): string {
    if (angle === 0) return 'N (0°)';
    if (angle === 90) return 'E (90°)';
    if (angle === 180) return 'S (180°)';
    if (angle === 270) return 'W (270°)';
    return `${angle}°`;
  }

  updateChart() {
    const numberOfPoints = this.getControlValue('points');
    const numberOfSectors = this.getControlValue('indicators');
    const maxSpeed = this.getControlValue('speed');
    const chartRadius = this.getControlValue('radius');
    const splitNumber = this.getControlValue('divisions');

    this.pointsChange.emit(numberOfPoints);
    this.windData = this.windService.getWindData(numberOfPoints);
    
    const { indicators, data, sectorData } = this.processWindData(numberOfSectors, maxSpeed);

    this.chartOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        position: 'top',
        formatter: (params: any) => {
          const sectorIndex = params.dataIndex;
          const speeds = sectorData[sectorIndex];
          const avgSpeed = params.value;
          const angle = (sectorIndex * (360 / numberOfSectors)) % 360;
          
          return `
            <div class="bg-gray-800/90 p-3 rounded-lg shadow-xl">
              <div class="font-bold text-white mb-2">Direction: ${angle}°</div>
              <div class="text-gray-200">Average Speed: ${avgSpeed.toFixed(1)} km/h</div>
              <div class="text-gray-400 text-sm">(${speeds.length} data points)</div>
            </div>
          `;
        }
      },
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

  private processWindData(numberOfSectors: number, maxSpeed: number) {
    const sectors: number[][] = Array(numberOfSectors).fill(0).map(() => []);
    const sectorSize = 360 / numberOfSectors;

    // Distribute wind data into sectors
    this.windData.forEach(point => {
      const sectorIndex = Math.floor(point.angle / sectorSize);
      if (sectorIndex >= 0 && sectorIndex < numberOfSectors) {
        sectors[sectorIndex].push(point.speed);
      }
    });

    // Calculate average speed for each sector
    const data = sectors.map(sectorSpeeds => 
      sectorSpeeds.length > 0 
        ? sectorSpeeds.reduce((sum, speed) => sum + speed, 0) / sectorSpeeds.length 
        : 0
    );

    // Create indicators for each sector - clockwise from North
    const indicators = Array.from({ length: numberOfSectors }, (_, i) => {
      const angle = (i * sectorSize) % 360;
      return {
        name: this.formatDirectionLabel(angle),
        max: maxSpeed
      };
    });

    return { indicators, data, sectorData: sectors };
  }
}