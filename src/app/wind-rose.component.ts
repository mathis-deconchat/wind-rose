import { Component, OnInit } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import { WindService, WindData } from './wind.service';

@Component({
  selector: 'app-wind-rose',
  standalone: true,
  imports: [NgxEchartsModule],
  template: `
    <div class="h-[600px] w-[600px] bg-gray-900 rounded-lg p-4">
      <div echarts [options]="chartOption" class="h-full w-full"></div>
    </div>
  `
})
export class WindRoseComponent implements OnInit {
  chartOption: EChartsOption = {};

  constructor(private windService: WindService) {}

  ngOnInit() {
    const indicators = Array.from({ length: 36 }, (_, i) => {
      const angle = (360 - (i * 10)) % 360;
      let label = '';
      if (angle === 0) label = 'N (0°)';
      else if (angle === 90) label = 'E (90°)';
      else if (angle === 180) label = 'S (180°)';
      else if (angle === 270) label = 'W (270°)';
      else label = `${angle}°`;

      return {
        name: label,
        max: 100
      };
    });

    const windData = this.windService.getWindData();
    const seriesData = this.processWindData(windData);

    this.chartOption = {
      backgroundColor: 'transparent',
                    tooltip: {
        trigger: 'axis'
      },
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
          value: seriesData,
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
    // Convert wind data to radar chart format
    // The array must be aligned with the indicators (36 points)
    return windData.map(data => data.speed);
  }
}