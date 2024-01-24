import {Component, Inject} from '@angular/core';
import {Starter} from "../_models/starter";
import {FormControl} from '@angular/forms';
import {ENTER} from "@angular/cdk/keycodes";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-create-starter',
  templateUrl: './create-starter.component.html',
  styleUrl: './create-starter.component.css'
})
export class CreateStarterComponent {

  myControl = new FormControl();
  starter = new Starter();

  readonly separatorKeysCodes = [ENTER] as const;

  constructor(public dialogRef: MatDialogRef<CreateStarterComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.starter = this.data.starter;
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    this.dialogRef.close(this.starter);
  }


}
