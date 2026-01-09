import { Output, Injectable, EventEmitter } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ScreenService {
  @Output() changed = new EventEmitter();
  // apiUrl = 'http://localhost:5000/api';
  apiUrl = 'https://ascomp.salesxceed.com:5000/api';
  constructor(private breakpointObserver: BreakpointObserver, private http: HttpClient) {
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large])
      .subscribe(() => this.changed.next(true));
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  getDocmentInfo2(QId: any, code: any) {
    let url = `${this.apiUrl}/config/getPrequeryData2?QueryId=${QId}`;
    return this.http.post(url, code);
  }

  executeData(reportId: any){
    let url = `${this.apiUrl}/config/executeData?reportId=${reportId}`;
    return this.http.post(url, reportId);
  }
  executeReportData(data: any){
    let url = `${this.apiUrl}/config/executeReportData`;
    return this.http.post(url, data);
  }
  executeWinnerData(data: any){
    let url = `${this.apiUrl}/config/executeWinnerData`;
    return this.http.post(url, data);
  }
  executeGreenReportData(data: any){
    let url = `${this.apiUrl}/config/executeGreenReportData`;
    return this.http.post(url, data);
  }
  executeGenericReportData(QId:any,data: any){
    debugger;
    let url = `${this.apiUrl}/config/executeGenericReportData?QueryId=${QId}`;
    return this.http.post(url, data);
  }

  getItemData (data: any){
    let url = `${this.apiUrl}/config/getItemData`;
    return this.http.post(url, data);
  }
  sendOtpToAdmin (data: any){
    let url = `${this.apiUrl}/auth/sendOtpToAdmin`;
    return this.http.post(url, data);
  }
  verifyOtp (data: any){
    let url = `${this.apiUrl}/auth/verifyOtp`;
    return this.http.post(url, data);
  }


  // Add these methods to your ScreenService class

// Create a new contact
createContact(contact: any) {
  const url = `${this.apiUrl}/master/savemaster`; // Adjust the endpoint as needed
  return this.http.post(url, contact);
}

// Update an existing contact
resturantLinkage(contactId: number, contactData: any) {
  debugger;
  const url = `${this.apiUrl}/master/saveResturantLinkage/${contactId}`; // Adjust the endpoint as needed
  return this.http.put(url, contactData);
}
updateContact(contactId: number, contactData: any) {
  const url = `${this.apiUrl}/master/savemaster/${contactId}`; // Adjust the endpoint as needed
  return this.http.put(url, contactData);
}

// Delete a contact
  deleteContact(contactId: number) {
    const url = `${this.apiUrl}/api/contacts/${contactId}`; // Adjust the endpoint as needed
    return this.http.delete(url);
  }

  updateReport(data: any){
    const url = `${this.apiUrl}/updateReportData/updateGreyPoints`;
    return this.http.post(url, data);
  }

  // Upload image file
  uploadImage(formData: any, entityType: string, fileName: string) {
    debugger;
    const url = `${this.apiUrl}/images/uploadImage?&EntityType=${entityType}&FileName=${fileName}`;
    
    return this.http.post(url, formData, {
      reportProgress: true,
      observe: 'events',
      headers: {
        'Accept': 'application/json'
      }
    });

    
  }

  champPurchaser(data: any){
    let url = `${this.apiUrl}/config/champPurchaser`;
    return this.http.post(url, data);
  }
  growthChamp(data: any){
    let url = `${this.apiUrl}/config/growthChamp`;
    return this.http.post(url, data);
  }
  skuRockstar(data: any){
    let url = `${this.apiUrl}/config/skuRockstar`;
    return this.http.post(url, data);
  }

  private isLargeScreen() {
    const isLarge = this.breakpointObserver.isMatched(Breakpoints.Large);
    const isXLarge = this.breakpointObserver.isMatched(Breakpoints.XLarge);

    return isLarge || isXLarge;
  }

  public get sizes(): Record<string, boolean> {
    return {
      'screen-x-small': this.breakpointObserver.isMatched(Breakpoints.XSmall),
      'screen-small': this.breakpointObserver.isMatched(Breakpoints.Small),
      'screen-medium': this.breakpointObserver.isMatched(Breakpoints.Medium),
      'screen-large': this.isLargeScreen(),
    };
  }
}
