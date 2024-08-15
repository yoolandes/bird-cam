import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { DatePipe } from '@angular/common';
import { ActiveViewersFacadeService } from '@bird-cam/active-viewers/infrastructure';

@Component({
  selector: 'bird-cam-viewer-history',
  templateUrl: './viewer-history.component.html',
})
export class ViewerHistoryComponent implements OnInit {
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
    private readonly activeViewersFacadeService: ActiveViewersFacadeService,
    private readonly datePipe: DatePipe
  ) {
    this.lineChartData$ = this.activeViewersFacadeService.activeViewers.pipe(
      map((activeViewers) => ({
        labels: Object.keys(activeViewers).map((date) =>
          this.datePipe.transform(date, 'HH')
        ),
        datasets: [
          {
            data: Object.values(activeViewers),
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
    this.activeViewersFacadeService.getMotionActivity();
  }
}
