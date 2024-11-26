import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app.component';
import { provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';

bootstrapApplication(App, {
  providers: [
    provideEchartsCore({ echarts })
  ]
});