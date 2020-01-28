import { Component, OnInit } from '@angular/core';
import { getEnvironment } from '../../../../../environments/environment';

@Component({
  selector: 'app-congestion',
  templateUrl: './congestion.component.html',
  styleUrls: ['./congestion.component.scss']
})
export class CongestionComponent implements OnInit {
  public environment = getEnvironment();
  constructor() { }

  /**
   * 初期化
   */
  public ngOnInit() {
  }

}
