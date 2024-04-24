import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { MotionActivityFacadeService } from '@bird-cam/motion-activity/infrastructure';
import { map, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'bird-cam-motion-activity',
  templateUrl: './motion-activity.component.html',
})
export class MotionActivityComponent implements OnInit {
  readonly lineChartData$: Observable<ChartConfiguration<'line'>['data']>;

  readonly lineChartOptions: ChartOptions<'line'> = {
    animation: false,
    responsive: true,
    scales: {
      x: {
        ticks: {
          font: {
            size: 14,
          },
          maxTicksLimit: 12,
        },
        border: {
          display: false,
        },
        grid: {
          display: true,
          drawTicks: false,
        },
      },
      y: {
        display: false,
      },
    },
  };

  constructor(
    private readonly motionActivityFacadeService: MotionActivityFacadeService,
    private readonly datePipe: DatePipe
  ) {
    this.lineChartData$ = this.motionActivityFacadeService.motionActivity$.pipe(
      map((motionActivity) => ({
        labels: Object.keys(motionActivity).map((date) =>
          this.datePipe.transform(date, 'HH')
        ),
        datasets: [
          {
            data: Object.values(motionActivity),
            fill: true,
            borderColor: 'rgba(255,255, 255,0.5)',
            showLine: true,
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.2,
            backgroundColor: 'rgba(0,0,0,0.2)',
          },
        ],
      }))
    );
  }
  ngOnInit(): void {
    this.motionActivityFacadeService.getMotionActivity();
  }
}
