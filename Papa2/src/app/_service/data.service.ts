import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Schuetze} from '../_interface/schuetze';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private serverUrl = 'http://192.168.188.21:3000';
  // private serverUrl = 'http://localhost:3000';
  public $shooter: Observable<Schuetze[]>;

  constructor(
    private http: HttpClient
  ) {
  }

  public getGlobalData(): void {
    this.$shooter = this.getToDo();
  }

  // POST
  public postToDo(object: Schuetze): Observable<Schuetze> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Schuetze>(`${this.serverUrl}/Schuetzen`, object, httpOptions);
  }

  // GET
  getToDo(): Observable<Schuetze[]> {
    return this.http.get<Schuetze[]>(`${this.serverUrl}/Schuetzen`);
  }

  // DELETE
  public deleteToDo(id: string): Observable<Schuetze> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.delete<Schuetze>(`${this.serverUrl}/Schuetzen/${id}`, httpOptions);
  }

  // PUT
  public putToDo(object: Schuetze): Observable<Schuetze> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put<Schuetze>(`${this.serverUrl}/Schuetzen/${object.id}`, object, httpOptions);
  }

}
