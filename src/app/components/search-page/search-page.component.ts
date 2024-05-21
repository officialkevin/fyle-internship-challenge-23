
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Repository, ApiResponse } from 'src/app/models/repository.model'; // Adjust the import path as necessary

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {
  searchForm!: FormGroup;
  username!: string;
  userdetail: any;
  repositories: Repository[] = []; // Declare repositories property
  nextPageUrl: string | null = null; // Declare nextPageUrl property
  perPage: number = 100;
  currentPage: number = 1; // Declare currentPage property
  pagination: number = 1;
  loader=true;
  totalcount=20;




  constructor(private apiservice: ApiService) {}

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      username: new FormControl(null)
    });
    this.loader=false;
  }

  sendUser(): void {
    this.username = this.searchForm.value.username;
    if (this.username) {
      this.loader = true;
      this.apiservice.getUser(this.username).subscribe({
        next: (data: any) => {
          this.userdetail = data;
          console.log(this.userdetail);
          this.currentPage = 1; // Reset currentPage when a new user is searched
          this.repositories = []; // Reset repositories array when a new user is searched
          this.loadRepositories();
          
        },
        error: () => {
          alert("You have entered a wrong username.");
          this.loader = false;
        },
        complete: () => {
          console.log("User fetch success");
          this.loader = false;
        }
      });
    } else {
      console.log("Username is empty");
    }
  }

  loadRepositories(): void {
    this.loader = true;
    this.apiservice.getRepos(this.username, this.perPage, this.currentPage).subscribe({
      next: (response: ApiResponse) => {
        this.repositories = [...this.repositories, ...response.repositories]; // Append new repositories to the existing array
        this.nextPageUrl = response.nextPageUrl;
        console.log(this.repositories);
      },
      error: () => {
        alert("Failed to fetch repositories.");
        this.loader = false;
      },
      complete: () => {
        console.log("Repositories fetch success");
        this.loader = false;
      }
    });
  }

  loadNextPage(): void {
    if (this.nextPageUrl) {
      this.currentPage++;
      this.loadRepositories();
    }
  }
}


