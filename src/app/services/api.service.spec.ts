

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { Repository, ApiResponse } from 'src/app/models/repository.model';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user details', () => {
    const dummyUser = { name: 'John Doe', avatar_url: 'avatar_url', bio: 'bio', location: 'location', twitter_username: 'twitter' };

    service.getUser('johnpapa').subscribe(user => {
      expect(user).toEqual(dummyUser);
    });

    const req = httpMock.expectOne(`https://api.github.com/users/johnpapa`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyUser);
  });

  it('should fetch repositories', () => {
    const dummyRepos: Repository[] = [
      { id: 1, name: 'repo1', html_url: 'url1', stargazers_count: 5, topics: [], description: 'desc1' },
      { id: 2, name: 'repo2', html_url: 'url2', stargazers_count: 10, topics: [], description: 'desc2' }
    ];

    service.getRepos('johnpapa', 10, 1).subscribe(response => {
      expect(response.repositories.length).toBe(2);
      expect(response.repositories).toEqual(dummyRepos);
      expect(response.nextPageUrl).toBeNull();
    });

    const req = httpMock.expectOne(`https://api.github.com/users/johnpapa/repos?per_page=10&page=1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyRepos);
  });
});
