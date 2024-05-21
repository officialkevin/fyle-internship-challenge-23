// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { SearchPageComponent } from './search-page.component';

// describe('SearchPageComponent', () => {
//   let component: SearchPageComponent;
//   let fixture: ComponentFixture<SearchPageComponent>;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [SearchPageComponent]
//     });
//     fixture = TestBed.createComponent(SearchPageComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });



import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { SearchPageComponent } from './search-page.component';
import { Repository, ApiResponse } from 'src/app/models/repository.model';

// Mock ApiService
class MockApiService {
  getUser(username: string) {
    return of({ name: 'John Doe', avatar_url: 'avatar_url', bio: 'bio', location: 'location', twitter_username: 'twitter' });
  }

  getRepos(username: string, perPage: number, page: number) {
    return of({
      repositories: [
        { id: 1, name: 'repo1', html_url: 'url1', stargazers_count: 5, topics: [], description: 'desc1' },
        { id: 2, name: 'repo2', html_url: 'url2', stargazers_count: 10, topics: [], description: 'desc2' }
      ],
      nextPageUrl: null
    });
  }
}

describe('SearchPageComponent', () => {
  let component: SearchPageComponent;
  let fixture: ComponentFixture<SearchPageComponent>;
  let apiService: ApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchPageComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: ApiService, useClass: MockApiService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPageComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.searchForm).toBeDefined();
  });

  it('should fetch user details on sendUser call', () => {
    component.searchForm.setValue({ username: 'johnpapa' });
    component.sendUser();
    expect(component.userdetail.name).toBe('John Doe');
  });

  it('should fetch repositories on loadRepositories call', () => {
    component.username = 'johnpapa';
    component.loadRepositories();
    expect(component.repositories.length).toBe(2);
    expect(component.repositories[0].name).toBe('repo1');
  });
});
