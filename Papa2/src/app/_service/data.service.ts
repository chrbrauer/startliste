import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Schuetze} from '../_interface/schuetze';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    //private serverUrl = 'http://192.168.188.21:3000';
    private serverUrl = 'http://localhost:3000';

    constructor(
        private http: HttpClient
    ) {
    }


    // POST
    public createSchuetze(vorname: string, nachname: string, slg: string) {
        return this.http.post(`${this.serverUrl}/Schuetze`, {}, {
            params: {
                vorname: vorname,
                nachname: nachname,
                SLG: slg
            }
        });
    }

    // POST
    public createStarter(wettkampf_id: number, Schuetze_id: number, disziplin_id: number, bahn: number, zeit: number) {
        return this.http.post(`${this.serverUrl}/Start`, {}, {
            params: {
                schuetze_id: Schuetze_id.toString(),
                wettkampf_id: wettkampf_id.toString(),
                disziplin_id: disziplin_id.toString(),
                bahn: bahn.toString(),
                zeit: zeit.toString()
            }
        });
    }

    // GET
    getSchuetzen(): Observable<any> {
        return this.http.get(`${this.serverUrl}/Schuetze`);
    }

    // GET
    getDisziplinen(): Observable<any> {
        return this.http.get(`${this.serverUrl}/Wettkampf`);
    }

    // GET
    getWettkaempfe(): Observable<any> {
        return this.http.get(`${this.serverUrl}/Disziplin`);
    }

    // GET
    getStarterliste(): Observable<any> {
        return this.http.get(`${this.serverUrl}/Starterliste`);
    }

    // DELETE
    public deleteStart(id: string) {
        return this.http.delete(`${this.serverUrl}/Start`, {params: {starter_id: id}});
    }

    // PUT
    public updateStart(zeit: number, bahn: number, status: number, id: number) {
        return this.http.put<Schuetze>(`${this.serverUrl}/Start`, {}, {
            params: {
                zeit: zeit.toString(),
                bahn: bahn.toString(),
                status: status.toString(),
                starter_id: id.toString()
            }
        });
    }

}
