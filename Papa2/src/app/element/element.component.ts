import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Schuetze} from '../_interface/schuetze';
import {DataService} from '../_service/data.service';

@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.css']
})
export class ElementComponent implements OnInit {

  @Input() shooter$: Schuetze;
  public colors = ['white', '#FFFF00', '#FF0000', '#00BFFF', '#04B404'];
  public ci;
  public cc;

  constructor(public dataService: DataService) {
    this.ci = 0;
  }

  ngOnInit() {
    this.ci = this.shooter$.status;
    this.cc = this.colors[this.ci];
  }

  public changeC(event?: any): void {
    if (this.ci === 4) {
      this.ci = 0;
    } else {
      this.ci++;
    }
    this.cc = this.colors[this.ci];
    this.shooter$.status = this.ci;
    if (this.ci === 1) {
      this.shooter$.ankunft = this.getcurrentTime();
    }
    if (this.ci === 4) {
      this.shooter$.geschossen = this.getcurrentTime();
    }
    this.dataService.putToDo(this.shooter$).subscribe((data: Schuetze) => {
      this.dataService.getGlobalData();
    });
  }

  public getcurrentTime(): string {
    const dateTime = new Date();
    return this.forwardzero(dateTime.getHours()) + ':' + this.forwardzero(dateTime.getMinutes()) + ':' + this.forwardzero(dateTime.getSeconds());
  }

  public forwardzero(time: number): string {
    if (time < 10) {
      return '0' + time;
    } else {
      return time + '';
    }
  }
}
