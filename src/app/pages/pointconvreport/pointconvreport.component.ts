import { Component, OnInit } from '@angular/core';
import { ScreenService } from 'src/app/shared/services';


@Component({
  selector: 'app-pointconvreport',
  templateUrl: './pointconvreport.component.html',
  styleUrls: ['./pointconvreport.component.scss']
})
export class PointconvreportComponent implements OnInit {
  fromDate: Date = new Date();
  toDate: Date = new Date();
  selectedDate: Date = new Date();
  selectedContacts: number[] = [];
  contacts: { id: number; name: string }[] = [];
  useButtons = true;
  reportData: any[] = [];
  isLoading = false; // Loading state for API calls
  dynamicGridHeight: any;


  constructor(private service: ScreenService) { }

  ngOnInit(): void {
    // Initialize dates to today
    this.updateDateRange();
    
    // Fetch contacts from service
    this.service.getDocmentInfo2('getContacts', {}).subscribe((data: any) => {
      this.contacts = data[0]['data'];
    });
  }

  onDateChange(e: any): void {
    if (e.value) {
      this.selectedDate = new Date(e.value);
      this.updateDateRange();
    }
  }

  private updateDateRange(): void {
    // Set both fromDate and toDate to the selected date
    this.fromDate = new Date(this.selectedDate);
    this.toDate = new Date(this.selectedDate);
  }

  refreshReport(): void {
    debugger;
    this.isLoading = true;
    this.service.executeGreenReportData({ContactId: this.selectedContacts, fromDate: this.fromDate, toDate: this.toDate}).subscribe({
      next: (data: any) => {
        if(data.length > 0){
          this.reportData = data;
        } else {
          alert("No data found");
          this.reportData = [];
        }
      },
      error: (error) => {
        console.error('Error fetching report data:', error);
        alert('Error fetching report data. Please try again.');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  updateReport(): void {  
    this.isLoading = true;
    const data = { data: { "greenpoints":  this.reportData} };
    this.service.updateReport(data).subscribe({
      next: (response: any) => {
        this.refreshReport();
        alert("Report updated successfully");
      },
      error: (error) => {
        console.error('Error updating report:', error);
        alert('Error updating report. Please try again.');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onGridContentReady(e: any): void {
    debugger
    const headerDrop = document.getElementById('headerdrop');
    
    if (headerDrop) {
      this.dynamicGridHeight = window.innerHeight - (headerDrop.clientHeight + 90);
    }
    
    const gridElement = e.component.getScrollable();
    // this.gridWidth = gridElement.scrollWidth();
    // console.log('Grid Width:', this.gridWidth, 'pixels');
  }

}

