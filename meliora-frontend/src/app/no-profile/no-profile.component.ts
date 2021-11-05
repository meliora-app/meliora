import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-profile',
  templateUrl: './no-profile.component.html',
  styleUrls: ['./no-profile.component.css']
})
export class NoProfileComponent implements OnInit {

  darkModeStatus: boolean = localStorage.getItem("darkModeStatus") == "true";
  constructor() { }

  ngOnInit(): void {
  }

}
