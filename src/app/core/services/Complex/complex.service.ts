import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedRequest } from '../../models/Paganation/paged-request.model';
import { PagedResponse } from '../../models/Paganation/paged-response.model';
import { Complex } from '../../models/Complex/complex.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComplexService {
  private baseUrl = `${environment.apiBase}/api/Complex`;

  constructor(private http: HttpClient) {}

  getPaged(request: PagedRequest): Observable<PagedResponse<Complex>> {
    return this.http
      .post<{ data: PagedResponse<Complex> }>(`${this.baseUrl}/Paged`, request)
      .pipe(map(res => res.data)); // 👈 ناخد الـ data بس
  }

  create(complex: Complex): Observable<any> {
    return this.http.post(`${this.baseUrl}`, complex);
  }

  update(id: number, complex: Complex): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, complex);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
