import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {

  constructor(private route: Router, private activatedRoute: ActivatedRoute) {}

  bio: string = "test";
  username: string;
  userID: string = localStorage.getItem('userID');


  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.bio = params.bio;
      this.username = params.username;
    })
  }

  returnToProfile() {
    this.route.navigate(['/profile'], { queryParams: {"_id": localStorage.getItem('userID')}});
  }

  async onSaveProfileClicked(newBio: string) {
    let res = await fetch('https://meliora-backend.herokuapp.com/api/users/updateProfile', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _id: this.userID,
        bio: newBio
      })
    });
    if (res.status == 200) {
      console.log("Successful account update");      
    }

  }
}
