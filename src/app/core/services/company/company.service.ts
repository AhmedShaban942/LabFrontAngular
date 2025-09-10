import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Company } from '../../models/company/company.model';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private apiUrl = `${environment.apiBase}/api/Company`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Company[]> {
    return this.http.get<{data: Company[]}>(this.apiUrl).pipe(
      map(res => res.data)
    );
  }

  getById(id: number): Observable<Company> {
    return this.http.get<{data: Company}>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }

  create(company: Company): Observable<Company> {
    return this.http.post<{data: Company}>(this.apiUrl, company).pipe(
      map(res => res.data)
    );
  }

  update(id: number, company: Company): Observable<Company> {
    return this.http.put<{data: Company}>(`${this.apiUrl}/${id}`, company).pipe(
      map(res => res.data)
    );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<{data: boolean}>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data)
    );
  }
}
