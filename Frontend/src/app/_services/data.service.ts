import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class DataService {

    private serverUrl = 'http://192.168.1.238:3000/starter';
    //private serverUrl = 'http://localhost:3000/starter';

    constructor(
        private http: HttpClient
    ) {
    }


    // POST
    public createStarter(wettkampf_id: number,name: string, disziplin: string, bahn: number, zeit: number) {
        return this.http.post(`${this.serverUrl}/Start`, {}, {
            params: {
                name: name,
                wettkampf_id: wettkampf_id.toString(),
                disziplin: disziplin,
                bahn: bahn.toString(),
                zeit: zeit.toString()
            }
        });
    }


    // GET
    getWettkaempfe(): Observable<any> {
        return this.http.get(`${this.serverUrl}/Wettkampf`);
    }

    // GET
    getStarterliste(Wettkampf: string): Observable<any> {
        return this.http.get(`${this.serverUrl}/Starterliste`, {params: {wettkampf_id: Wettkampf}});
    }

    // DELETE
    public deleteStart(id: string) {
        return this.http.delete(`${this.serverUrl}/Start`, {params: {starter_id: id}});
    }

  // PUT
  public updateStart(zeit: number, bahn: number, status: number, id: number) {
    return this.http.put(`${this.serverUrl}/Start`, {}, {
      params: {
        zeit: zeit.toString(),
        bahn: bahn.toString(),
        status: status.toString(),
        starter_id: id.toString()
      }
    });
  }


}
