import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';
import { IncomeService } from 'src/app/shared/services/income.service';
import * as moment from 'moment';

export interface IncomeElement {
  date_program: Date;
  program: string;
  debit: number;
  credit: number;
  balance: number;
  note: string;
}

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {
  income_data: any = [];
  price_all: [];
  token: string;
  dateString: string;
  today = new Date();
  debit = 0;
  credit = 0;
  month = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]
  change = 'lg';
  watcher: Subscription;
  displayedColumns: string[] = ['date_program', 'program', 'credit', 'debit', 'balance', 'note', 'actions'];
  dataSource: MatTableDataSource<IncomeElement>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    mediaObserver: MediaObserver,
    public dialogService: DialogService,
    private tokenStorage: TokenStorageService,
    private incomeService: IncomeService
  ) {
    this.change = 'lg';
    this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'xs') {
        this.change = 'xs';
      } else if (change.mqAlias === 'sm') {
        this.change = 'sm';
      } else if (change.mqAlias === 'md') {
        this.change = 'md';
      }
      else {
        this.change = 'lg';
      }
    });

  }

  ngOnInit(): void {
    this.dateString = `${this.today.getDate()} ${this.month[this.today.getMonth() + 1]} ${this.today.getFullYear() + 543}`
    this.income_data = []
    this.token = this.tokenStorage.getToken()
    // หาข้อมูลผู้ใช้ทั้งหมด
    this.incomeService.findAllIncome(this.token).subscribe(response => {
      // นำข้อมูลที่ถูกส่งมาจาก api ใส่ไว้ใน this.user_data
      response.forEach(data => {
        if (parseInt(moment.utc(data.createdAt).format('MM')) === this.today.getMonth() + 1) {
          this.debit += data.debit;
          this.credit += data.credit;
        }
        let dataIncome = {
          id: data.id,
          date_program: data.date_program,
          date_program_tranform: `${parseInt(moment.utc(data.date_program).format('DD'))} ${this.month[parseInt(moment.utc(data.date_program).format('MM')) - 1]} ${parseInt(moment.utc(data.date_program).format('YYYY')) + 543}`,
          program: data.program,
          credit: data.credit,
          debit: data.debit,
          balance: data.balance,
          note: data.note
        }
        this.income_data.push(dataIncome)
      });
      // นำข้อมูลใน this.user_data ไปใส่ใน this.dataSource เพื่อนำไปใช้ใน filter
      this.dataSource = new MatTableDataSource(this.income_data)
      // ทำให้ this.dataSource sort ได้
      this.dataSource.sort = this.sort;
      // ทำให้ this.dataSource แบ่งหน้าได้
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource);

    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialogCreateIncome() {
    this.dialogService.openDialogAddIncome(this.token).afterClosed().subscribe(res => {
      if (res === true) {
        this.reloadPage()
      }
    })
  }

  getBalance() {
    return this.dataSource.filteredData.map(t => t.balance).reduce((acc, value) => acc + value, 0);
  }
  getCredit() {
    return this.dataSource.filteredData.map(t => t.credit).reduce((acc, value) => acc + value, 0);
  }
  getDebit() {
    return this.dataSource.filteredData.map(t => t.debit).reduce((acc, value) => acc + value, 0);
  }

  editIncome(data) {
    this.dialogService.openDialogUpdateIncome(this.token, data).afterClosed().subscribe(res => {
      if (res === true) {
        this.reloadPage()
      }
    })
  }

  deleteIncome(id) {
    console.log(id);

    this.dialogService.openDialogConfirm("ลบรายการรายรับ - รายจ่าย", "ต้องการลบข้อมูลรายรับ - รายจ่ายใช่หรือไม่?").afterClosed().subscribe(res => {
      if (res === "true") {
        this.incomeService.deleteIncome(this.token, id).subscribe(response => {
          if (response.status === true) {
            this.reloadPage()
          }
        })
      }
    })
  }

  reloadPage(): void {
    // โหลดหน้า
    window.location.reload();
  }
}
