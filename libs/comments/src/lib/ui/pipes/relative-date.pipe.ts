import {Pipe, PipeTransform} from '@angular/core';

export interface Result {
  key: string;
  value: number;
}

@Pipe({
  name: 'relativeDate'
})
export class RelativeDatePipe implements PipeTransform {

  private readonly seconds = 1000;
  private readonly minutes = this.seconds * 60;
  private readonly hours = this.minutes * 60;
  private readonly days = this.hours * 24;
  private readonly weeks = this.days * 7;
  private readonly months = this.days * 31;
  private readonly years = this.months * 12;

  transform(value: string | undefined): Result {
    const result: Result = {
      value: 0,
      key: ''
    };
    if (!value) {
      return result;
    }
    value = value.replace(' ', 'T');
    value = value + '.000Z';
    const diff = Math.floor(new Date().getTime() - new Date(value).getTime());

    if (Math.floor(diff / this.years)) {
      result.key = 'comments.creationDate.year';
      result.value = Math.floor(diff / this.years);
    } else if (Math.floor(diff / this.months)) {
      result.key = 'comments.creationDate.months';
      result.value = Math.floor(diff / this.months);
    } else if (Math.floor(diff / this.weeks)) {
      result.key = 'comments.creationDate.weeks';
      result.value = Math.floor(diff / this.weeks);
    } else if (Math.floor(diff / this.days)) {
      result.key = 'comments.creationDate.days';
      result.value = Math.floor(diff / this.days);
    } else if (Math.floor(diff / this.hours)) {
      result.key = 'comments.creationDate.hours';
      result.value = Math.floor(diff / this.hours);
    } else if (Math.floor(diff / this.minutes)) {
      result.key = 'comments.creationDate.minutes';
      result.value = Math.floor(diff / this.minutes);
    } else {
      result.key = 'comments.creationDate.seconds';
      result.value = Math.floor(diff / this.seconds);
    }
    return result;
  }

}
