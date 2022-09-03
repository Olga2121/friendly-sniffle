const searchForm = document.querySelector("input");
const searchFormContainer = document.querySelector(".dropdown-container");
const selectedRepository = document.querySelector(".chosens");

function a(event) {
    let target = event.target;
    if (!target.classList.contains("btn-close")) {

        return;
    }
    target.parentElement.remove();

};
selectedRepository.addEventListener("click", a);


function b(event) {
    let target = event.target;
    if (!target.classList.contains("dropdown-content")) {

        return;
    }

    addRepository(target);
    searchForm.value = "";
    removeRepository();

};
searchFormContainer.addEventListener("click", b);


function removeRepository() {
    searchFormContainer.innerHTML = "";
}

function showSelectedRepository(repositories) {
    removeRepository();

    for (let repositoryIndex = 0; repositoryIndex < 5; repositoryIndex++) {
        let name = repositories.items[repositoryIndex].name;
        let owner = repositories.items[repositoryIndex].owner.login;
        let stars = repositories.items[repositoryIndex].stargazers_count;

        let drop = `<div class="dropdown-content" data-owner="${owner}" data-stars="${stars}">${name}</div>`;
        searchFormContainer.innerHTML += drop;
    }
}

function addRepository(target) {
    let name = target.textContent;
    let owner = target.dataset.owner;
    let stars = target.dataset.stars;

    selectedRepository.innerHTML += `<div class="chosen">Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars}<button class="btn-close"></button></div>`;
}

async function getSelectedRepository() {
    const urlSearchRepositories = new URL("https://api.github.com/search/repositories");
    let repositoriesPart = searchForm.value;
    if (repositoriesPart == "") {
        removePreds();
        return;
    }

    urlSearchRepositories.searchParams.append("q", repositoriesPart)
    try {
        let response = await fetch(urlSearchRepositories);
        if (response.ok) {
            let repositories = await response.json();
            showSelectedRepository(repositories);
        } else return null;
    } catch (error) {
        return null;
    }
}

function cancellation(fn, timeout) {
    let timer = null;

    return (...args) => {
        clearTimeout(timer);
        return new Promise((resolve) => {
            timer = setTimeout(
                () => resolve(fn(...args)),
                timeout,
            );
        });
    };
}

const deleteGetSelectedRepository = cancellation(getSelectedRepository, 500);
searchForm.addEventListener("input", deleteGetSelectedRepository);