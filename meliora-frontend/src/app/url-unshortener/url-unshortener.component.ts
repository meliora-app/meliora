import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../shared/services/userServices/user.service';

@Component({
  selector: 'app-url-unshortener',
  templateUrl: './url-unshortener.component.html',
  styleUrls: ['./url-unshortener.component.css']
})
export class UrlUnshortenerComponent implements OnInit {
  shortID: string;

  constructor(
    private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.shortID = params.id;
    });

    let longID = this.findLongID();
    this.router.navigate(['/profile'], {
      queryParams: {
        _id: longID
      },
    });
  }

  async findLongID() {
    let res = await fetch('https://meliora-backend.herokuapp.com/api/users/getLongID', {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        shortID: this.shortID
      })
    });

    if (res.status != 200) {
      this.router.navigate(['/home']);
      return;
    }

    let resBody = await res.json();

    console.log(resBody);

    return resBody;
  }

}
