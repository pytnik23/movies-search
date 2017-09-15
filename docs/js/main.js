(function() {

    const searchInput       = document.getElementById('searchInput');
    const moviesTable       = document.getElementById('moviesTable');
    const moviesTableBody   = moviesTable.querySelector('tbody');
    const sortButtons       = moviesTable.querySelectorAll('.sort-btn');
    let movies              = [];

    searchInput.addEventListener('keydown', (e) => {
        if (e.keyCode !== 13 || e.target.value.length < 1) return;
        getData(e.target.value);
    });

    function getData(str) {
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=100e19718c5c111cd812c685b760d2c3&query=${str}`)
        .then(res => res.json())
        .then(data => {
            movies = data.results;
            showTable(movies);
        })
        .catch(console.error);
    }

    function showTable(movies) {
        let tableBody = '';

        movies.forEach((movie) => {
            tableBody += `
            <tr>
                <td>${movie.id}</td>
                <td>${movie.title}</td>
                <td>${movie.original_language}</td>
                <td>${movie.popularity}</td>
                <td>${movie.vote_count}</td>
                <td>${movie.vote_average}</td>
                <td>${movie.release_date}</td>
            </tr>
            `;
        });

        moviesTableBody.innerHTML = tableBody;
        moviesTable.style.display = 'table';
    }

    moviesTable.querySelector('#moviesTable thead').addEventListener('click', (e) => {
        const target = e.target;
        if ( !target.classList.contains('sort-btn') ) return;

        if ( target.classList.contains('sort-btn_up') ) {
            target.classList.remove('sort-btn_up');
            target.classList.add('sort-btn_down');
            sortTable(target.dataset.sort, false);
        } else if ( target.classList.contains('sort-btn_down') ) {
            target.classList.remove('sort-btn_down');
            target.classList.add('sort-btn_up');
            sortTable(target.dataset.sort, true);
        } else {
            sortButtons.forEach((button) => {
                button.classList.remove('sort-btn_up');
                button.classList.remove('sort-btn_down');
            });
            target.classList.add('sort-btn_up');
            sortTable(target.dataset.sort, true);
        }
    });

    function sortTable(key, direction) {
        if (typeof movies[0][key] === 'number') {
            movies.sort((a, b) => {
                return direction ?
                    a[key] - b[key] :
                    b[key] - a[key];
            });
        } else if (movies[0][key].match(/(\d{2,4}-\d{2}-\d{2})/)) {
            movies.sort((a, b) => {
                return direction ?
                Date.parse(a[key]) - Date.parse(b[key]) :
                Date.parse(b[key]) - Date.parse(a[key]);
            });
        } else if (typeof movies[0][key] === 'string') {
            movies.sort((a, b) => {
                if (a[key] > b[key]) {
                    return direction ? 1 : -1;
                } else if (a[key] < b[key]) {
                    return direction ? -1 : 1;
                } else {
                    return 0;
                }
            });
        }
        showTable(movies);
    }

})();
