const searchList = document.querySelector('.search-list');
const searchInput = document.querySelector('.search-input');
const fragment = document.createDocumentFragment();

let boundEventHandler;

function onChange(event) {
    let url = new URL('https://api.github.com/search/repositories');
    url.searchParams.set('q', event.target.value);

    fetch(url)
        .then((response) => response.json())
        .then((response) => autoCompleter(response))
        .catch((err) => console.log(err))
}

function autoCompleter(response) {
    searchList.innerHTML = '';

    for (let i = 0; i < 5; i++) {
        const searchListItem = document.createElement('li');
        searchListItem.textContent = response.items[i].name;
        searchListItem.classList.add('search-list__item')
        searchListItem.setAttribute('data-id', `${i}`);
        fragment.appendChild(searchListItem);
    }
    searchList.appendChild(fragment);

    // if (boundEventHandler) {
    //     searchList.removeEventListener('click', boundEventHandler);
    // }
    boundEventHandler = mainHandler(response);
    // searchList.addEventListener('click', boundEventHandler);
    searchList.onclick = boundEventHandler;
}

function mainHandler(response) {
    return function(event) {
        const currentID = event.target.dataset.id;
        const repoList = document.querySelector('.repo-list');
        repoList.insertAdjacentHTML(
            'afterbegin',
            `<li class="repo-list__item">
                    <ul>
                      <li>Name: ${response.items[currentID].name}</li>
                      <li>Owner: ${response.items[currentID].owner.login}</li>
                      <li>Stars: ${response.items[currentID].stargazers_count}</li>
                    </ul>
                      <div class="repo-list__close" data-cross>X</div>
                   </li>`
        )
        // const repoListClose = document.querySelector('.repo-list__close');
        // const repoListItem = document.querySelector('.repo-list__item');
        // repoListClose.addEventListener('click', (e) => {
        //     repoListItem.remove()
        // })
        searchInput.value = '';
        searchList.innerHTML = '';
    }
}

const debounce = (func, ms) => {
    let timeout;

    return function() {
        const fnCall = () => {
            func.apply(this, arguments);
        }
        clearTimeout(timeout);
        timeout = setTimeout(fnCall, ms);
    };
}

function deleteElement(event) {
    if (event.target.dataset.cross !== undefined) {
        const deletingElement = event.target.closest('li');
        deletingElement.remove();
    }
}

onChange = debounce(onChange, 400);
searchInput.addEventListener('keyup', onChange);
document.addEventListener('click', deleteElement);
