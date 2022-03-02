import {Component, OnInit, OnDestroy} from '@angular/core';
import {Schuetze} from '../_interface/schuetze';
import {DragulaService} from 'ng2-dragula';
import {interval, Subscription} from 'rxjs';
import {DataService} from '../_service/data.service';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';


@Component({
    selector: 'app-tabelle',
    templateUrl: './tabelle.component.html',
    styleUrls: ['./tabelle.component.css']
})
export class TabelleComponent implements OnInit, OnDestroy {

    public shooters: Schuetze[];
    public bea: Schuetze[] = Object.assign([], this.shooters);
    public races: Schuetze[][];
    public planeraces: Schuetze[][];
    public lanes: number;
    public subs = new Subscription();
    public updateSubscription;
    public drag;
    public addPlayer;
    public newShooter: Schuetze;
    public lastid;
    public fun;

    constructor(
        public dataService: DataService,
        public dragularService: DragulaService
    ) {
        this.addPlayer = false;
        this.fun = false;
        this.loadData();
        this.newShooter = {
            id: 0,
            name: '',
            dicipline: '',
            time: null,
            lane: 0,
            status: 0
        };

        this.dragularService.createGroup('transfer', {
            removeOnSpill: true,
            copy: false,
            accepts(el, handle) {
                return el.id !== 'clock';
            },
            direction: 'vertical'
        });
        this.subs.add(dragularService.drop('transfer').subscribe(({el, target, source}) => {

            if (target.children.length > 1) {
                let ce;
                if (target.lastElementChild !== el) {
                    ce = target.lastElementChild;
                } else {
                    ce = target.firstElementChild;
                }
                this.postime(+ce.id, this.extrLane(source.id), this.extrTime(source.id));
                source.append(ce);
            }
            if ((+this.extrTime(target.id) % 6) === 0) {
                this.nextrace(+this.extrTime(target.id));
            }
            this.postime(+el.id, this.extrLane(target.id), this.extrTime(target.id));
            this.PrepareData();

        }));

        this.subs.add(dragularService.drag('transfer').subscribe(({el}) => {
            this.drag = true;
        }));

        this.subs.add(dragularService.dragend('transfer').subscribe(({el}) => {
            this.drag = false;
        }));
        this.subs.add(dragularService.remove('transfer').subscribe(({el}) => {
            this.dataService.deleteToDo(el.id).subscribe((data: Schuetze) => {

            });
        }));
    }

    ngOnInit() {
        this.refresh();
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public loadData(): void {
        this.shooters = [];
        this.dataService.getToDo().subscribe((data: Schuetze[]) => {
            this.shooters = data;
            this.PrepareData();
        });
    }

    public PrepareData(): void {
        this.findlastid(this.shooters);
        this.countlanes();
        this.sortTime(this.shooters);
        this.checktimes();
        this.createRaces();
        console.log(this.lanes);
        this.gen();
    }

    public sortTime(s: Schuetze[]): void {
        const res = [];
        for (const e of s) {
            res.push(e);
        }
        res.sort((obj1, obj2) => {
            return obj1.time - obj2.time;
        });
        this.bea = res;
    }

    public createRaces(): void {
        const res: Schuetze[][] = [];
        let cet: Schuetze[] = [this.bea[0]];
        for (const entry of this.bea) {
            if (cet[0].time !== entry.time) {
                res.push(cet);
                cet = [entry];
            } else {
                if (entry.lane !== cet[0].lane) {
                    cet.push(entry);
                } else {
                    console.log(entry);
                }
            }
        }
        if (cet.length > 0) {
            res.push(cet);
        }
        this.planeraces = res;
        this.races = res;
    }

    public sortlane(s: Schuetze[], tims: number): Schuetze[] {
        let timer;
        const res = [];
        if (tims === 0) {
            timer = 0;
        } else {
            timer = tims;
        }
        const ce: Schuetze[] = s.sort((l1, l2) => {
            return l1.lane - l2.lane;
        });
        let cez = 0;
        for (const entry of ce) {
            while (entry.lane - cez > 1) {
                const o: Schuetze = {
                    id: 0,
                    name: '',
                    dicipline: '',
                    time: timer,
                    lane: cez + 1,
                    status: 0
                };
                res.push(o);
                cez++;
            }
            res.push(entry);
            cez++;
        }
        while (res.length < this.lanes) {
            const o: Schuetze = {
                id: 0,
                name: '',
                dicipline: '',
                time: timer,
                lane: res.length + 1,
                status: 0
            };
            res.push(o);
        }
        return res;
    }

    public gen(): void {
        const res: Schuetze[][] = [];
        let cnt = 1;
        for (const ces of this.races) {
            if (cnt > 5) {
                res.push(this.sortlane([], 0));
                cnt = 1;
            }
            const ce = this.sortlane(ces, ces[0].time);
            res.push(ce);
            cnt++;
        }
        res.push(this.sortlane([], 0));
        this.races = res;
    }

    public postime(id: number, nlane: number, time: number): void {
        const ntime = this.calctime(time);
        console.log(id + ' ' + time + ' ' + ntime);
        for (const s of this.shooters) {
            if (s.id === id) {
                s.lane = nlane;
                s.time = ntime;
                this.dataService.putToDo(s).subscribe((data: Schuetze) => {
                });
                return;
            }
        }
    }

    calctime(n: number): number {
        if (n % 6 === 0) {
            return n - Math.floor((n - 0.1) / 6);
        } else {
            return n - Math.floor((n + 0.1) / 6);
        }
    }

    public extrTime(id: string): number {
        const ce = id.split(';', 1);
        return +ce[0];
    }

    public extrLane(id: string): number {
        const ce = id.split(';', 2);
        return +ce[1];
    }

    public countlanes(): string[] {
        const res = [];
        let max = 0;
        for (const sh of this.shooters) {
            if (sh.lane > max) {
                max = sh.lane;
            }
        }
        while (max > 0) {
            res.push('Bahn ' + max.toString());
            max--;
        }
        this.lanes = res.length;
        return res.reverse();
    }

    playAudio(n: string, event?: any): void {
        const audio = new Audio();
        audio.src = '/assets/_sounds/' + n;
        audio.load();
        audio.play();
    }

    nextstate(s: Schuetze[]): void {
        let ces;
        if (s[0].status > 1 && s[0].status !== 4) {
            ces = s[0].status + 1;
        } else {
            ces = 2;
        }
        for (const ce of s) {
            ce.status = ces;
            this.dataService.putToDo(ce).subscribe((data: Schuetze) => {

            });
        }
        this.loadData();
    }

    getFreeLane(time: number): number {
        const tmp = this.planeraces[time - 1].length;
        console.log(tmp);
        if (tmp < this.lanes) {
            return tmp + 1;
        } else {
            return -1;
        }
    }

    add(event?: any): void {
        this.newShooter.id = this.lastid + 1;
        const lane = this.getFreeLane(this.newShooter.time);
        if (lane > 0) {
            this.newShooter.lane = lane;
            this.dataService.postToDo(this.newShooter).subscribe((data: Schuetze) => {
            });
        }
        this.addPlayer = false;
        this.newShooter.name = '';
        this.newShooter.dicipline = '';
        this.newShooter.time = null;
        this.newShooter.id++;
        this.loadData();
    }

    addn(event?: any) {
        this.addPlayer = !this.addPlayer;
    }

    showrace(n: number): string {
        if (n === 0) {
            return '\n';
        } else {
            return 'Rennen' + '\n' + n.toString();
        }
    }

    nextrace(r: number): void {
        const time = this.calctime(r);
        for (const sh of this.shooters) {
            if (sh.time >= time) {
                sh.time += 1;
                this.dataService.putToDo(sh).subscribe((data: Schuetze) => {
                });
            }
        }
    }

    checktimes(): void {
        const c = this.countraces();
        let cnt = 1;
        while (cnt <= c) {
            if (!this.nexttime(cnt)) {
                this.reducerace(cnt);
            }
            cnt++;
        }
    }

    nexttime(n: number): boolean {
        for (const e of this.shooters) {
            if (e.time === n + 1) {
                return true;
            }
        }
        return false;
    }

    countraces(): number {
        let max = 0;
        for (const i of this.shooters) {
            if (i.time > max) {
                max = i.time;
            }
        }
        return max;
    }

    reducerace(r: number): void {
        for (const i of this.shooters) {
            if (i.time > r) {
                i.time -= 1;
                this.dataService.putToDo(i).subscribe((data: Schuetze) => {

                });
            }
        }
    }

    findlastid(s: Schuetze[]): void {
        let high;
        for (const e of s) {
            if (e.id > high) {
                high = e.id;
            }
        }
        this.lastid = high;
    }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showfun() {
        (async () => {
            this.fun = true;
            await this.delay(3000);
            this.fun = false;
        })();
    }


    public refresh(): void {
        this.updateSubscription = interval(10000).subscribe(
            (val) => {
                if (!this.drag) {
                    this.loadData();
                }
            });
    }
}
