import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';
import { DialogService } from 'src/app/shared/services/dialog.service';

import { IncomeService } from 'src/app/shared/services/income.service';

@Component({
  selector: 'app-graph-dialog',
  templateUrl: './graph-dialog.component.html',
  styleUrls: ['./graph-dialog.component.scss']
})
export class GraphDialogComponent implements OnInit {
  monthInconme: any = []
  yearInconme: any = []
  today = new Date();
  month = this.today.getMonth() + 1
  year = this.today.getFullYear()
  monthArr = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]
  constructor(@
    Inject(MAT_DIALOG_DATA) public data,
    public tokenStorage: TokenStorageService,
    private authService: AuthService,
    public incomeService: IncomeService,
    public dialogRef: MatDialogRef<GraphDialogComponent>,
    public dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.incomeService.findAllIncome(this.data.token).subscribe(response => {
      response.forEach(data => {
        let dataIncome = {
          program: data.program,
          date: `${parseInt(moment.utc(data.date_program).format('DD'))} ${this.monthArr[parseInt(moment.utc(data.date_program).format('MM')) - 1]} ${parseInt(moment.utc(data.date_program).format('YYYY')) + 543}`,
          credit: data.credit,
          debit: data.debit
        }
        if (parseInt(moment.utc(data.date_program).format('YYYY')) === this.year) {
          this.yearInconme.push(dataIncome)
          if (parseInt(moment.utc(data.date_program).format('MM')) === this.month) {
            this.monthInconme.push(dataIncome)
          }
        }
      });
    })
  }

  closeDialog() {
    this.dialogRef.close(false)
  }
}
