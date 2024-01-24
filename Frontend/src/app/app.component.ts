import {ActivatedRoute, RouterOutlet} from '@angular/router';
import {Component} from '@angular/core';
import {DataService} from "./_services/data.service";
import {Subscription} from "rxjs";
import {Starter} from "./_models/starter";
import {Wettkampf} from "./_models/wettkampf";
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import {getFocusableBoundaryElements} from "@ng-bootstrap/ng-bootstrap/util/focus-trap";
import {MatDialog} from "@angular/material/dialog";
import {CreateStarterComponent} from "./create-starter/create-starter.component";





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Frontend';

  constructor(
    private route: ActivatedRoute,
    public dataService: DataService,
    public dialog: MatDialog
  ) {
  }

  public shooters: Starter[] = [];
  public races: Starter[][] = [];
  public labels: string[] = []
  public wettkaempfe: Wettkampf[] = [];
  public disziplinen = [];
  public moveStarter: Starter[] = [];

  public wettkampf_id;
  public Wettkampf


  ngOnInit(): void {
    this.route.queryParams.subscribe(
      res => {
        this.wettkampf_id = res['Wettkampf'];
        if (this.wettkampf_id != undefined) {
          this.loadData(this.wettkampf_id);
          this.loadMetaData();
        } else {
          this.loadMetaData();
        }
      });
  }

  public loadData(Wettkampf: string): void {
    this.shooters = [];
    this.dataService.getStarterliste(Wettkampf).subscribe((res) => {
      this.shooters = res['content'].filter((i) => i.name != '')
      const anzahl_rennen = this.shooters.sort((a, b) => {
        return b.zeit - a.zeit
      })[0].zeit
      const anzahl_bahnen = this.shooters.sort((a, b) => {
        return b.bahn - a.bahn
      })[0].bahn
      this.labels = this.createLabel(anzahl_bahnen);
      this.races = this.createRaces(this.shooters, anzahl_rennen, anzahl_bahnen);

    });
  }

  public loadMetaData(): void {
    this.dataService.getWettkaempfe().subscribe((res) => {
      this.wettkaempfe = res['content'];
      if (this.wettkampf_id != undefined)
        this.Wettkampf = this.wettkaempfe.find((w) => w.id == Number.parseInt(this.wettkampf_id))
      else
        this.Wettkampf = {name: "Wettkampf auswählen"}
    });
  }

  public createRaces(liste: Starter[], rennen: number, bahnen: number): Starter[][] {
    const result: Starter[][] = []
    for (let i = 1; i < rennen; i++) {

      const searched_racer = liste.filter((ce) => {
        return ce.zeit == i
      })
      const current_race: Starter[] = []
      for (let j = 0; j < bahnen; j++) {
        const ce = searched_racer.find(i => i.bahn == j + 1)
        if (ce == undefined) {
          current_race.push(this.createPlaceholder(i, j+1))
        } else {
          current_race.push(ce)
        }
      }
      result.push(current_race);
    }
    return result
  }

  public createLabel(bahnen: number): string[] {
    const result: string[] = []
    for (let i = 1; i <= bahnen; i++) {
      result.push("Bahn " + i.toString())
    }
    return result;
  }

  public createPlaceholder(zeit: number, bahn: number): Starter {
    const result = new Starter()
    result.zeit = zeit
    result.bahn = bahn
    return result
  }

  public move(starter: Starter): void {
    this.moveStarter.push(starter)
    if (this.moveStarter.length == 2) {
      const s1 = this.moveStarter[0];
      const s2 = this.moveStarter[1];
      if (s1.id != undefined)
        this.dataService.updateStart(s2.zeit, s2.bahn, s1.status, s1.id).subscribe((res) => {
          if (s2.id != undefined)
            this.dataService.updateStart(s1.zeit, s1.bahn, s2.status, s2.id).subscribe((res) => {
              this.moveStarter = [];
              this.loadData(this.wettkampf_id);
            })
          else {
            this.moveStarter = [];
            this.loadData(this.wettkampf_id);
          }
        })
      else if (s2.id != undefined)
        this.dataService.updateStart(s1.zeit, s1.bahn, s2.status, s2.id).subscribe((res) => {
          this.moveStarter = [];
          this.loadData(this.wettkampf_id);
        })
      else
        this.moveStarter = [];
    }
  }

  OpenCreationDialog(): void {
    const dialogRef = this.dialog.open(CreateStarterComponent, {
      width: '400px',
      data: {starter: this.createPlaceholder(this.races.length + 2, 1), title: 'Schützen hinzufügen'},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.dataService.createStarter(this.wettkampf_id, result['name'], result['disziplin'], result['bahn'], result['zeit']).subscribe((res) =>{
          this.loadData(this.wettkampf_id)
        })
      }
    });
  }


}
