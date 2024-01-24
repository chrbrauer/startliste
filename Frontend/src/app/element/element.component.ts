import {Component, Input} from '@angular/core';
import {Starter} from "../_models/starter";
import {DataService} from "../_services/data.service";

@Component({
  selector: 'app-element',
  templateUrl: './element.component.html',
  styleUrl: './element.component.css'
})
export class ElementComponent {
  @Input() starter: Starter
  public colors = ['bg-light', 'bg-warning', 'bg-danger', 'bg-info', 'bg-success'];
  public current_color: string = 'bg-light'
  isSingleClick: Boolean = true;

  constructor(public dataService: DataService) {
  }

  public changeC(): void {
    if (this.starter.status == 4) {
      this.starter.status = 0
    } else {
      this.starter.status += 1
    }
    this.dataService.updateStart(this.starter.zeit, this.starter.bahn, this.starter.status, this.starter.id).subscribe((res) => {
    })
  }

  method1CallForClick(){
    this.isSingleClick = true;
    setTimeout(()=>{
      if(this.isSingleClick){
        this.changeC();
      }
    },250)
  }
  method2CallForDblClick(){
    this.isSingleClick = false;
  }

  public move($event): void {
    if (this.starter.status == 0)
      this.starter.status = 3
    else {
      if (this.starter.status == 1)
        this.starter.status = 4;
      else
        this.starter.status -= 2
    }
    this.dataService.updateStart(this.starter.zeit, this.starter.bahn, this.starter.status, this.starter.id).subscribe((res) => {
    })

  }


}
