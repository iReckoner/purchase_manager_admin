import { Component, OnInit } from '@angular/core';
import { ScreenService } from 'src/app/shared/services';

@Component({
  selector: 'app-greenptsreport',
  templateUrl: './greenptsreport.component.html',
  styleUrls: ['./greenptsreport.component.scss']
})
export class GreenptsreportComponent implements OnInit {
  dateFilterOptions: string[] = ['Yearly', 'Monthly'];
  fromDate: Date = new Date();
  toDate: Date = new Date();
  selectedContacts: number[] = [];
  contacts: { id: number; name: string }[] = [];
  useButtons = true;
  reportData: any[] = [];
  isLoading = false; // Loading state for API calls
  
  // Month and year selection
  months = [
    { name: 'January', value: 0 },
    { name: 'February', value: 1 },
    { name: 'March', value: 2 },
    { name: 'April', value: 3 },
    { name: 'May', value: 4 },
    { name: 'June', value: 5 },
    { name: 'July', value: 6 },
    { name: 'August', value: 7 },
    { name: 'September', value: 8 },
    { name: 'October', value: 9 },
    { name: 'November', value: 10 },
    { name: 'December', value: 11 }
  ];
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();

  constructor(private service: ScreenService) { }

  ngOnInit(): void {
    // Initialize dates based on current month and year
    this.updateDateRange();
    
    // Fetch contacts from service
    this.service.getDocmentInfo2('getContacts', {}).subscribe((data: any) => {
      this.contacts = data[0]['data'];
    });
  }

  onDateFilterChange(e: any): void {
    const today = new Date();
    const filterType = e.value;

    if (filterType === 'Yearly') {
      this.fromDate = new Date(today.getFullYear(), 0, 1);
      this.toDate = new Date(today.getFullYear(), 11, 31);
    } else if (filterType === 'Monthly') {
      this.fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
      this.toDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }
  }

  onMonthChange(e: any): void {
    this.selectedMonth = e.value;
    this.updateDateRange();
  }

  onYearChange(e: any): void {
    this.selectedYear = e.value;
    this.updateDateRange();
  }

  private updateDateRange(): void {
   
    this.fromDate = new Date(this.selectedYear, this.selectedMonth, 1);
    
    this.toDate = new Date(this.selectedYear, this.selectedMonth + 1, 0);
  }

  refreshReport(): void {
    debugger;
    this.isLoading = true;
    this.service.executeGenericReportData('getGreenPointReport',{ContactId: this.selectedContacts, fromDate: this.fromDate, toDate: this.toDate}).subscribe({
      next: (data: any) => {
        if(data.length > 0){
          this.reportData = data[0]['data'];
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

}
