import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../shared/services/category.service';
import { PostService } from '../shared/services/post.service';
import { ToastService } from '../shared/services/toast.service';
import { Category } from '../shared/models/category.model';
import { 
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask,
 } from '@angular/fire/storage';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent implements OnInit {
  darkModeStatus = localStorage.getItem('darkModeStatus') == 'true';
  visibilityClicked: boolean = false;
  imageClicked: boolean = false;
  commentClicked: boolean = false;
  draftClicked: boolean = false;
  categories: Category[];
  words: number = 0;
  image = null;
  postID = null;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  Lat: any = -1;
  Long: any = -1;

  @ViewChild("post-content") postArea: ElementRef;

  constructor(
    private postService: PostService,
    private router: Router,
    private toast: ToastService,
    private categoryService: CategoryService,
    private fireStorage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.getCategories();
    console.log(localStorage.getItem('userID'));
    // this.getLocation();
    (this.getCoordintes());
    //console.log(this.Lat, this.Long);

  }


  /* getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        this.callApi(longitude, latitude);
      });
    } else {
      console.log("No support for geolocation")
    }
  }
  
  
  callApi(Longitude: number, Latitude: number) {
    const url = `https://api-adresse.data.gouv.fr/reverse/?lon=${Longitude}&lat=${Latitude}`
    //Call API
    //this.Lat = Latitude;
    //this.Long = Longitude;
    console.log(this.Lat);
    console.log(this.Long);
  } */

  // Step 1: Get user coordinates
  async getCoordintes() {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    var self = this;

    function success(pos) {
      var crd = pos.coords;
      var lat = crd.latitude.toString();
      var lng = crd.longitude.toString();

      var coordinates = [lat, lng];
      console.log(`Latitude: ${lat}, Longitude: ${lng}`);
      self.Lat = lat;
      self.Long = lng;

      //this.getCity(coordinates);
      return;

    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    await navigator.geolocation.getCurrentPosition((pos) => {
      var crd = pos.coords;
      var lat = crd.latitude.toString();
      var lng = crd.longitude.toString();

      var coordinates = [lat, lng];
      console.log(`Latitude: ${lat}, Longitude: ${lng}`);
      this.Lat = lat;
      this.Long = lng;

      //this.getCity(coordinates);
      return;

    }, error, options);
  }



  // Step 2: Get city name
  getCity(coordinates) {
    var xhr = new XMLHttpRequest();
    var lat = coordinates[0];
    var lng = coordinates[1];

    // Paste your LocationIQ token below.
    xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.3a2d61c374d0a273d49f754cc252fcd4&lat=" +
      lat + "&lon=" + lng + "&format=json", true);
    xhr.send();
    xhr.onreadystatechange = processRequest;
    xhr.addEventListener("readystatechange", processRequest, false);

    function processRequest(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var response = JSON.parse(xhr.responseText);
        var city = response.address.city;
        console.log(city);
        return;
      }
    }
  }



  async getCategories() {
    (await this.categoryService.getAll()).subscribe((categoryData) => {
      this.categories = categoryData;
    });
  }

  wordCount(event) {
    this.words = event.target.value
      ? event.target.value.split(/\s+/).length
      : 0;
  }

  async onSubmitPost(form: NgForm) {
    var categoryIndex = this.categories.findIndex(
      (item) => item.name === form.value.category
    );
    var categoryID = this.categories[categoryIndex].id;
    console.log(form.value.category);
    console.log(this.categories);
    console.log(categoryIndex);
    console.log(categoryID);
    this.postID = await this.postService.createPost(
      form.value.title,
      form.value.content,
      categoryID,
      localStorage.getItem('userID'),
      this.visibilityClicked,
      !this.commentClicked
    );

    if (this.image != null)
      this.uploadImage();

    this.router.navigate(['/home']);
    this.toast.showSuccessMessage('Post created successfully', 'Post');
  }

  onVisibilityClicked() {
    this.visibilityClicked = !this.visibilityClicked;
    console.log(this.visibilityClicked);
  }

  onImageClicked() {
    this.imageClicked = !this.imageClicked;
  }

  onDraftClicked() {
    this.draftClicked = !this.draftClicked;
  }

  recordLocation() {
    this.postArea.nativeElement.setAttribute("value", this.postArea.nativeElement.value + this.Lat + "," + this.Long);
  }

  removeLocation() {

  }


  onCommentClicked() {
    this.commentClicked = !this.commentClicked;
  }

  cacheImageForUpload(event) {
    this.image = event.target.files[0];
  }

  uploadImage() {
    this.ref = this.fireStorage.ref('postPictures/' + this.postID);
    this.task = this.ref.put(this.image);
  }
}
