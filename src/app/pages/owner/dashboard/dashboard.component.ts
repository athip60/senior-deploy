import { Component, OnInit } from '@angular/core';

import Chart from 'chart.js';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { AuthService } from 'src/app/shared/services/auth.service';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';
import { DialogService } from 'src/app/shared/services/dialog.service';

import { RoomService } from 'src/app/shared/services/room.service';
import { IncomeService } from 'src/app/shared/services/income.service';
import { BlogService } from 'src/app/shared/services/blog.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // เก็บข้อมูล user ทั้งหมด
  user_data_all: any = []

  // เก็บข้อมูลห้องทั้งหมด
  room_all: any = []

  // เก็บสถานะห้องทั้งหมด (มี 3 สถานะ)
  room_total = [0, 0, 0]
  // รายรับรายจ่าย รายปี
  creditYear = 0;
  debitYear = 0;

  // ตัวแปรที่จำนำรายรับรายจ่ายไปเก็บในกราฟเส้น
  dataDebitYear = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  dataCreditYear = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  // ตัวแปรที่จำนำไว้ไปเก็บในกราฟวงกลม
  showdataCircle = [0, 0]

  // เก็บข้อมูลวันนี้
  today = new Date();
  month = this.today.getMonth() + 1
  year = this.today.getFullYear()
  monthArr = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]

  // เก็บ token ผู้ใช้งานที่ login อยู่
  token: string;

  public canvas: any;
  public ctx;

  // ตัวแปร graph 
  public chartCircle;
  public chartBarHorizon;

  constructor(
    public router: Router,
    public authService: AuthService,
    public roomService: RoomService,
    public tokenStorage: TokenStorageService,
    public incomeService: IncomeService,
    public dialogService: DialogService,
    public blogService: BlogService,
  ) { }

  ngOnInit() {
    // เก็บ token คนที่ login อยู่
    this.token = this.tokenStorage.getToken()

    // เรียกดูข้อมูลผู้ใช้ในระบบเพื่อนำไป length และนำไปแสดงผล
    this.user_data_all = []
    this.authService.findAllDesc(this.token).subscribe(response => {
      // เตรียมข้อมูลผู้ใช้ และแปรงวันที่เป็นภาษาไทย
      response.forEach(data => {
        let dataJson = {
          name: data.name + ' ' + data.surname,
          createdAt: `${parseInt(moment.utc(data.createdAt).format('DD'))} ${this.monthArr[parseInt(moment.utc(data.createdAt).format('MM')) - 1]} ${parseInt(moment.utc(this.user_data_all['createdAt']).format('YYYY')) + 543}`
        }
        this.user_data_all.push(dataJson)
      });
    })

    // เก็บข้อมูลห้องพัก และเก็บข้อมูลสถานะของห้องพักเพื่อนำไปแสดงผล
    this.roomService.findAll(this.token).subscribe(response => {
      this.room_all = response
      let empty_room = 0
      let usable = 0
      let room = 0
      response.forEach(data => {
        if (data.room_status === 'ห้องว่าง') {
          empty_room += 1
        } else if (data.room_status === 'ห้องใช้งานไม่ได้') {
          usable += 1
        } else {
          room += 1
        }
      });
      this.room_total[0] = empty_room
      this.room_total[1] = room
      this.room_total[2] = usable
    })

    // กำหนดค่ามาเก็บใส่ไว้ในกราฟวงกลม
    let debitCircle = 0
    let creditCircle = 0
    this.incomeService.sumIncome(this.token).subscribe(response => {
      response.forEach(data => {
        // ถ้าเป็นปี ปัจจุบัน
        if (parseInt(moment.utc(data.date_program).format('YYYY')) === this.year) {
          // เก็บใส่ใน array นำแหน่งตาม (เดือน -1)
          this.dataDebitYear[parseInt(moment.utc(data.date_program).format('MM')) - 1] = parseInt(data.debit)
          this.dataCreditYear[parseInt(moment.utc(data.date_program).format('MM')) - 1] = parseInt(data.credit)
          // เก็บค่ารายรับรายจ่ายในปีปัจจุบันเพื่อนำไปแสดงผล
          this.debitYear += parseInt(data.debit)
          this.creditYear += parseInt(data.credit)
          // check ว่าเดือนใน db เป็นเดือนเดียวกันกับเดือนปัจจุบันหรือเปล่า
          if (parseInt(moment.utc(data.date_program).format('MM')) === this.month) {
            // เก็บค่ารายรับรายจ่ายในเดือนปัจจุบันเพื่อนำไปใส่ใน กราฟวงกลม
            debitCircle += parseInt(data.debit)
            creditCircle += parseInt(data.credit)
          }
          // ข้อมูลที่จะนำไปใส่ในกราฟวงกลม [รายรับ,รายจ่าย]
          this.showdataCircle[0] = creditCircle
          this.showdataCircle[1] = debitCircle
        }
      });
    })
    // กราฟวงกลม
    this.canvas = document.getElementById("chartCircle");
    this.ctx = this.canvas.getContext("2d");
    this.chartCircle = new Chart(this.ctx, {
      type: 'doughnut',
      data: {
        labels: [
          'รายรับ',
          'รายจ่าย'
        ],
        datasets: [{
          label: "กราฟวงกลม",
          pointRadius: 0,
          pointHoverRadius: 0,
          backgroundColor: [
            '#4acccd',
            '#ef8157'
          ],
          borderWidth: 0,
          data: this.showdataCircle
        }]
      },
      options: {
        legend: {
          display: false
        },

        tooltips: {
          titleFontSize: 18,
          bodyFontSize: 15,
        },
        scales: {
          yAxes: [{
            ticks: {
              display: false
            },
            gridLines: {
              drawBorder: false,
              zeroLineColor: "transparent",
              color: 'rgba(255,255,255,0.05)'
            }
          }],

          xAxes: [{
            barPercentage: 1.6,
            gridLines: {
              drawBorder: false,
              color: 'rgba(255,255,255,0.1)',
              zeroLineColor: "transparent"
            },
            ticks: {
              display: false,
            }
          }]
        },
      }
    });

    // กราฟเส้นแสดงข้อมูลรายรับ - รายจ่าย ของแต่ละเดือนในทั้งปี
    var speedCanvas = document.getElementById("speedLine");
    var dataFirst = {
      data: this.dataCreditYear,
      fill: false,
      borderColor: '#51CACF',
      backgroundColor: 'transparent',
      pointBorderColor: '#51CACF',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointBorderWidth: 8
    };
    var dataSecond = {
      data: this.dataDebitYear,
      fill: false,
      borderColor: '#fbc658',
      backgroundColor: 'transparent',
      pointBorderColor: '#fbc658',
      pointRadius: 4,
      pointHoverRadius: 4,
      pointBorderWidth: 8,
    };

    var lineChart = new Chart(speedCanvas, {
      type: 'line',
      hover: false,
      data: {
        labels: this.monthArr,
        datasets: [dataFirst, dataSecond]
      },
      options: {
        tooltips: {
          titleFontSize: 18,
          bodyFontSize: 15,
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              fontFamily: "maledpan",
              fontSize: 15,
            }
          }],
          yAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              fontFamily: "maledpan",
              fontSize: 15,
            }
          }]
        },
      }
    });

    // กราฟ Bar
    this.canvas = document.getElementById("chartBarHorizon");
    this.ctx = this.canvas.getContext("2d");
    this.chartBarHorizon = new Chart(this.ctx, {
      // กำหนด tpye horizontalBar เพื่อให้ได้  graph bar แกน x
      type: 'horizontalBar',
      data: {
        labels: ['ห้องว่าง', 'มีผู้เข้าพักแล้ว', 'ใช้ไม่ได้'],
        datasets: [{
          axis: 'y',
          data: this.room_total,
          fill: false,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        tooltips: {
          titleFontSize: 18,
          bodyFontSize: 15,
        },
        legend: {
          display: false
        },
        indexAxis: 'y',
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              fontFamily: "maledpan",
              fontSize: 15,
            }
          }],
          yAxes: [{
            gridLines: {
              display: false
            },
            ticks: {
              fontFamily: "maledpan",
              fontSize: 15,
            }
          }]
        },
      }
    });
  }

  // เปิด Dialog Graph เพื่อดูข้อมูลรายละเอียด Graph
  openDialogGraph(nameGraph) {
    this.dialogService.openDialogViewGraph(this.token, nameGraph, this.showdataCircle, this.creditYear, this.debitYear).afterClosed().subscribe(res => {
    })
  }

  // function route ไปหน้าอื่น 
  routerTo(path) {
    this.router.navigate([`/owner/${path}`]);
  }
}
