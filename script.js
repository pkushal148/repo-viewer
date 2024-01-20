let currentPage = 1;
let perPage = 10;
let totalRepos=0;

function loadUserAndRepositories() {
  const username = document.getElementById('username').value;


  
  if (!username) {
      alert('Please enter a GitHub username.');
      return;
  }
  
  showLoader(true);

  fetch(`https://api.github.com/users/${username}`)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then(userData => {
          // Display user details
          displayUserData(userData);
          return fetch(`https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${currentPage}`);
      })
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then(repositoriesData => {
          showLoader(false);
          displayRepositories(repositoriesData);
      })
      .catch(error => {
          showLoader(false);
          console.error('Error:', error);
          alert(`Error: ${error.message}`);
      });
}

function displayRepositories(repositories) {
    const repositoriesDiv = document.getElementById('repositories');
    repositoriesDiv.innerHTML = '';

    if (repositories.length === 0) {
        repositoriesDiv.innerHTML = '<p>No repositories found for the given user.</p>';
        return;
    }

    repositories.forEach(async repo => {

      const languagesResponse = await fetch(repo.languages_url);
      const languagesData = await languagesResponse.json();

        repositoriesDiv.innerHTML += `
            <div class="card mb-2">
                <div class="card-body">
                    <h5 class="card-title">${repo.name}</h5>
                    <p class="card-text">${repo.description || 'No description available.'}</p>
                    
                    <div class="tech" id="languages">
                        ${formatLanguages(languagesData)}
                    </div>
                    <a href="${repo.html_url}" class="btn btn-primary mt-3" target="_blank">View on GitHub</a>
                </div>
            </div>
        `;
    });

    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';

    const last = Math.ceil(totalRepos / perPage);
    
    // if (repositories.length >= perPage) {
        paginationDiv.innerHTML += `
            <div>
              <button class="btn btn-primary m-4" onclick="changePage(-1)" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
              <button class="btn btn-primary" onclick="changePage(1)" ${currentPage === last ? 'disabled' : ''}>Next</button>
            </div>
            `;
    // }
}


function formatLanguages(languagesData) {
  const languages = Object.keys(languagesData);
  const languageSpans = languages.map(language => `<span class="badge text-bg-primary">${language}</span>`);
  return languageSpans.join(' ');
}

function changePage(delta) {
    currentPage += delta;
    loadUserAndRepositories();
}

function showLoader(show) {
    const loader = document.getElementById('loader');
    loader.style.display = show ? 'block' : 'none';
}

function displayUserData(userData) {
  const userDiv = document.getElementById('user');
  totalRepos=userData.public_repos;
  userDiv.innerHTML = `

      <div class="container-1 m-2 p-3">
        <div class="box-1">
          <img class="box-1-image mb-3" src="${userData.avatar_url}" alt="profile pic">
          <p><strong>GitHub Link:</strong> <a href="${userData.html_url}" target="_blank">${userData.html_url}</a></p>
        </div>
        <div class="box-2">
          <h2>${userData.name}</h2>
          <p>${userData.bio || 'No bio available.'}</p>
          <p><strong><i class="fa fa-map-marker" style="font-size:36px"></i></strong> ${userData.location || 'Not specified'}</p>
        </div>
         
      </div>
      
  `;
}
