import { Component, OnInit, HostListener } from '@angular/core';
import { ScreenService } from 'src/app/shared/services';

@Component({
  selector: 'app-champ-purchaser',
  templateUrl: './champ-purchaser.component.html',
  styleUrls: ['./champ-purchaser.component.scss']
})
export class ChampPurchaserComponent implements OnInit {
  dateFilterOptions: string[] = ['Yearly', 'Monthly'];
  fromDate: Date = new Date();
  toDate: Date = new Date();
  selectedContacts: number[] = [];
  contacts: { id: number; name: string }[] = [];
  useButtons = true;
  reportData: any[] = [];
  isLoading = false; // Loading state for API calls
  selectedRowKeys: any[] = [];
  currentRow: any = {};
  

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
  dynamicGridHeight: any;


  constructor(private service: ScreenService) { }

  ngOnInit(): void {
    // Initialize dates based on current month and year
    this.updateDateRange();
    
    // Fetch contacts from service
    this.service.getDocmentInfo2('getContacts', {}).subscribe((data: any) => {
      this.contacts = data[0]['data'];
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calculateGridHeight();
  }

  calculateGridHeight() {
    const headerDrop = document.getElementById('headerdrop');
    if (headerDrop) {
      this.dynamicGridHeight = window.innerHeight - (headerDrop.clientHeight + 90);
    }
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
    // Set fromDate to the 1st day of the selected month
    this.fromDate = new Date(this.selectedYear, this.selectedMonth, 1);
    // Set toDate to the last day of the selected month
    this.toDate = new Date(this.selectedYear, this.selectedMonth + 1, 0);
  }

  refreshReport(): void {
    debugger;
    this.isLoading = true;
    const payload = {
      fromDate: this.toPureDate(this.fromDate),
      toDate: this.toPureDate(this.toDate)
    };
    this.service.champPurchaser(payload).subscribe({
      next: (data: any) => {
        if(data.length > 0){
          this.reportData = data;
          this.selectedRowKeys = [];
          const selectedRows = this.reportData.filter(x => x.isCheck !== false);
          this.selectedRowKeys.push(selectedRows[0].contactId);
        } else {
          alert("No data found");
          this.reportData = [];
        }
      },
      error: (error) => {
        //console.error('Error fetching report data:', error);
        alert(error.error.message);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  toPureDate(date: any): string {
    if (!date) return '';
  
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

  updateReport(): void {  
    if (!this.currentRow || !this.currentRow.contactId) {
      alert('Please select a row to update');
      return;
    }

    this.isLoading = true;
    
    // Create a copy of the current row with updated date
    const updatedRow = {
      ...this.currentRow,
      HofDate: this.toPureDate(this.fromDate)
    };

    // Send only the selected row for update
    const data = { 
      data: { 
        "ChampPurchaser": [updatedRow]  // Wrap in array to match expected API format
      } 
    };

    this.service.updateReport(data).subscribe({
      next: (response: any) => {
        // Update the local data to reflect changes
        const index = this.reportData.findIndex(item => item.contactId === this.currentRow.contactId);
        if (index !== -1) {
          this.reportData[index] = { ...updatedRow };
        }
        alert("Row updated successfully");
      },
      error: (error) => {
        console.error('Error updating report:', error);
        alert('Error updating row. Please try again.');
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onGridContentReady(e: any): void {
    debugger
    this.calculateGridHeight();
    
    const gridElement = e.component.getScrollable();
    // this.gridWidth = gridElement.scrollWidth();
    // console.log('Grid Width:', this.gridWidth, 'pixels');
  }

  onEditClick(e: any) {
    debugger;
    let tabId: number | undefined;
    
    if (e.data) {
      // If called from grid's onRowClick
      tabId = e.data.tabId;
    }
    
    if (tabId) {
      // this.router.navigate(['/events', 'edit', tabId]);
    }
  }

  onFocusedRowChanged(e: any) {
    if (e.row && e.row.data) {
      this.currentRow = e.row.data;
      
    }
  }

  onSelectionChanged(e: any): void {
    if (e.selectedRowKeys.length > 0) {
      const latestKey = e.selectedRowKeys[e.selectedRowKeys.length - 1];
  
      this.selectedRowKeys = [latestKey];
  
      this.currentRow = this.reportData.find(
        item => item.contactId === latestKey
      );
    } else {
      this.currentRow = null;
    }
  }
  
}
