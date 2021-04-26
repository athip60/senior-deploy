import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { IncomeService } from 'src/app/shared/services/income.service';

@Component({
  selector: 'app-update-income',
  templateUrl: './update-income.component.html',
  styleUrls: ['./update-income.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'th-TH' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class UpdateIncomeComponent implements OnInit {

  progressBar = false;
  form: any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<UpdateIncomeComponent>,
    public dialogService: DialogService,
    public incomeService: IncomeService
  ) { }

  ngOnInit(): void {
    this.form = this.data.data
    console.log(this.form);
  }

  onSubmit() {
    this.dialogService.openDialogConfirm('เพิ่มรายรับ - รายจ่าย', 'ยืนยันข้อมูลใช่หรือไม่?').afterClosed().subscribe(res => {
      if (res === "true") {
        if (this.form.credit > this.form.debit) {
          this.form.balance = this.form.credit - this.form.debit
        } else {
          this.form.balance = this.form.debit - this.form.credit
        }
        this.incomeService.updateIncome(this.data.token, this.form).subscribe((createIncome) => {
          this.dialogRef.close(true)
        })
      }
    })

  }

  closeDialog() {
    this.dialogRef.close(false)
  }

}
