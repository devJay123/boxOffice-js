const API_KEY = config.API_KEY;

const boxOfficeContainer = document.querySelector(
  '.boxOffice .slide_container'
);
const searchBtn = document.getElementById('searchBtn');
const searchBoxOfficeContainer = document.querySelector(
  '.searchBoxOffice .slide_container'
);
const moviesContainer = document.querySelector('.movies_container');
const moviesLoading = document.querySelector('.movies_loading');

let today = new Date();
today.setDate(today.getDate() - 1);

let targetDt = today.toISOString().split('T')[0].split('-').join('');

const lastDay = new Date(today);
lastDay.setDate(lastDay.getDate() - 7);

let weeklyTargetDt = lastDay.toISOString().split('T')[0].split('-').join('');

let todayBoxOfficeMsg = '';
let weeklyBoxOfficeMsg = '';

let boxBtns = document.querySelectorAll('.box_btn');

boxBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    boxBtns.forEach((btn) => {
      btn.classList.remove('on');
    });
    e.currentTarget.classList.add('on');
  });
});

async function getMoviesInfoImg(result) {
  const movieInfoPromises = result.map(async (item, idx) => {
    const movieInfo = await getMovieInfo(item.movieCd);
    const img = await getMovieImg(item.movieCd);

    return { ...item, genres: movieInfo.genres, imgUrl: img.imgUrl };
  });

  const moviesWithGenres = await Promise.all(movieInfoPromises);

  return moviesWithGenres;
}

// 일별 박스오피스 조회
async function getDailyBoxOffice(date) {
  // (필수) 조회하고자 하는 날짜를 yyyymmdd 형식으로 입력합니다.
  // let targetDt = '20240520';
  //   결과 ROW 의 개수를 지정합니다.(default : “10”, 최대 : “10“)
  let itemPerPage = '';
  //   다양성 영화/상업영화를 구분지어 조회할 수 있습니다.
  //   “Y” : 다양성 영화 “N” : 상업영화 (default : 전체)
  let multiMovieYn = '';
  //   한국/외국 영화별로 조회할 수 있습니다.
  //   “K: : 한국영화 “F” : 외국영화 (default : 전체)
  let repNationCd = '';
  //   상영지역별로 조회할 수 있으며, 지역코드는 공통코드 조회 서비스에서 “0105000000” 로서 조회된 지역코드입니다. (default : 전체)
  let wideAreaCd = '';

  let url = new URL(
    `https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=${API_KEY}&targetDt=${date}`
  );

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    if (data == null) {
      alert('조회 결과가 없습니다.');
      return;
    }

    let result = data.boxOfficeResult.dailyBoxOfficeList;

    let moviesWithGenres = await getMoviesInfoImg(result);

    todayBoxOfficeMsg = moviesWithGenres
      .map(
        (movie) => `
                    <li>
                        <a href='./detail.html?movieCd=${movie.movieCd}'>
                            <div class="slide_imgBox">
                                <div class="rank">${
                                  moviesWithGenres.indexOf(movie) + 1
                                }</div>
                                <img src="${
                                  movie.imgUrl === ''
                                    ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/495px-No-Image-Placeholder.svg.png?20200912122019'
                                    : movie.imgUrl
                                }" alt="" />
                            </div>
                            <div class="movie_txt">
                                <p class="movieNm">${movie.movieNm}</p>
                                <p class="movieGenre">${movie.genres
                                  .map((el) => el.genreNm)
                                  .join(',')}</p>
                                <span>${movie.openDt} 개봉</span>
                            </div>
                        </a>
                    </li>
                  `
      )
      .join('');

    return todayBoxOfficeMsg;
  } catch (error) {
    console.log(error);
  }
}

// 주간/주말 박스오피스 조회
async function getWeeklyBoxOffice(date) {
  // (필수) 조회하고자 하는 날짜를 yyyymmdd 형식으로 입력합니다.
  // let targetDt = '20240514';
  // 주간/주말/주중을 선택 입력합니다
  // “0” : 주간 (월~일)
  // “1” : 주말 (금~일) (default)
  // “2” : 주중 (월~목)
  let weekGb = '';
  //   결과 ROW 의 개수를 지정합니다.(default : “10”, 최대 : “10“)
  let itemPerPage = '';
  //   다양성 영화/상업영화를 구분지어 조회할 수 있습니다.
  //   “Y” : 다양성 영화 “N” : 상업영화 (default : 전체)
  let multiMovieYn = '';
  //   한국/외국 영화별로 조회할 수 있습니다.
  //   “K: : 한국영화 “F” : 외국영화 (default : 전체)
  let repNationCd = '';
  //   상영지역별로 조회할 수 있으며, 지역코드는 공통코드 조회 서비스에서 “0105000000” 로서 조회된 지역코드입니다. (default : 전체)
  let wideAreaCd = '';

  let url = new URL(
    `http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchWeeklyBoxOfficeList.json?key=${API_KEY}&targetDt=${date}`
  );

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    if (data == null) {
      alert('조회 결과가 없습니다.');
      return;
    }

    let result = data.boxOfficeResult.weeklyBoxOfficeList;

    let moviesWithGenres = await getMoviesInfoImg(result);

    weeklyBoxOfficeMsg = moviesWithGenres
      .map(
        (movie) => `
                    <li>
                        <a href='./detail.html?movieCd=${movie.movieCd}'>
                            <div class="slide_imgBox">
                            <div class="rank">${
                              moviesWithGenres.indexOf(movie) + 1
                            }</div>
                                <img src="${
                                  movie.imgUrl === ''
                                    ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/495px-No-Image-Placeholder.svg.png?20200912122019'
                                    : movie.imgUrl
                                }" alt="" />
                            </div>
                            <div class="movie_txt">
                                <p class="movieNm">${movie.movieNm}</p>
                                <p class="movieGenre">${movie.genres
                                  .map((el) => el.genreNm)
                                  .join(',')}</p>
                                <span>${movie.openDt} 개봉</span>
                            </div>
                        </a>
                    </li>
                  `
      )
      .join('');

    return weeklyBoxOfficeMsg;
  } catch (error) {
    console.log(error);
  }
}

let todayBoxOffice = '';
let weekBoxOffice = '';

// 박스오피스 날짜검색, 일별, 주간 리스트에 삽입
async function insertBoxOffice(period) {
  if (period == 'today') {
    // boxOfficeContainer.classList.remove('loaded');
    // boxOfficeContainer.innerHTML = await getDailyBoxOffice(targetDt);

    boxOfficeContainer.innerHTML = todayBoxOffice;
    setTimeout(() => {
      boxOfficeContainer.classList.add('loaded');
    }, 100);
  } else if (period == 'weekly') {
    // boxOfficeContainer.classList.remove('loaded');
    // boxOfficeContainer.innerHTML = await getWeeklyBoxOffice(weeklyTargetDt);

    boxOfficeContainer.innerHTML = weekBoxOffice;
    setTimeout(() => {
      boxOfficeContainer.classList.add('loaded');
    }, 100);
  } else if (period == 'search') {
    const searchInputDate = document.getElementById('date').value;
    let selectDate = new Date(searchInputDate);

    if (!searchInputDate) {
      alert('날짜를 입력하세요');
      return;
    } else if (selectDate > today) {
      alert('1일전까지만 조회가 가능합니다.');
      return;
    }

    console.log(typeof searchInputDate);

    let searchDate = searchInputDate.split('-').join('');

    searchBoxOfficeContainer.classList.remove('loaded');
    searchBoxOfficeContainer.innerHTML = await getDailyBoxOffice(searchDate);
    setTimeout(() => {
      searchBoxOfficeContainer.classList.add('loaded');
    }, 80);
  }
}

// 영화목록조회
async function getMovies(obj) {
  // 현재 페이지를 지정합니다.(default : “1”)
  let curPage = '';
  // 결과 ROW 의 개수를 지정합니다.(default : “10”)
  let itemPerPage = '';
  // 영화명으로 조회합니다. (UTF-8 인코딩)
  let movieNm = '';
  // 감독명으로 조회합니다. (UTF-8 인코딩)
  let directorNm = '';
  // YYYY형식의 조회시작 개봉연도를 입력합니다.
  let openStartDt = '';
  // YYYY형식의 조회종료 개봉연도를 입력합니다.
  let openEndDt = '';
  // YYYY형식의 조회시작 제작연도를 입력합니다.
  let prdtStartYear = '';
  //   YYYY형식의 조회종료 제작연도를 입력합니다.
  let prdtEndYear = '';
  //   N개의 국적으로 조회할 수 있으며, 국적코드는 공통코드 조회 서비스에서 “2204” 로서 조회된 국적코드입니다. (default : 전체)
  let repNationCd = '';
  //   N개의 영화유형코드로 조회할 수 있으며, 영화유형코드는 공통코드 조회 서비스에서 “2201”로서 조회된 영화유형코드입니다.
  // (default: 전체)
  let movieTypeCd = '';

  let endPoint = `https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=${API_KEY}`;
  let querys = ``;
  for (let key in obj) {
    querys += `&${key}=${obj[key]}`;
  }
  endPoint += querys;

  let url = new URL(endPoint);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.movieListResult.movieList;
  } catch (error) {
    console.log(error);
  }
}

let moviesPage = 1;
let movieList = '';

// 영화 목록에 리스트 삽입
async function insertMovies() {
  let list = await getMovies({ curPage: moviesPage, itemPerPage: 20 });

  list = list.filter((el) =>
    // el.prdtStatNm !== '촬영진행' &&
    // el.prdtStatNm !== '개봉준비' &&
    {
      if (
        (el.prdtStatNm == '개봉' || el.prdtStatNm == '개봉예정') &&
        !el.repGenreNm.includes('성인물') &&
        el.repNationNm !== '일본'
      ) {
        return true;
      }
    }
  );

  const promises = list.map(async (el) => {
    let img = await getMovieImg(el.movieCd);
    return { ...el, imgUrl: img.imgUrl };
  });

  const items = await Promise.all(promises);

  items.forEach((el) => {
    movieList += `<li>
                  <a href='./detail.html?movieCd=${el.movieCd}'>
                    <div class="list_item">
                      <div class="list_imgBox">
                        <img src="${
                          el.imgUrl === ''
                            ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/495px-No-Image-Placeholder.svg.png?20200912122019'
                            : el.imgUrl
                        }"  alt=""/>
                      </div>
                      <p class="movieNm">${el.movieNm}</p>
                      <p class="movieGenre">${el.prdtStatNm}</p>
                      </a>
                    </div>
                  </li>`;
  });

  moviesContainer.innerHTML = movieList;
}

// 영화 이미지 가져오기
async function getMovieImg(movieCd) {
  const response = await fetch('./src/movie_img.json');

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  const imgArr = data.moviesImg;

  let result = imgArr.find((img) => img.movieCd === movieCd);

  if (!result) {
    result = { movieCd: movieCd, imgUrl: '' };
  }

  return result;
}

// 영화상세정보
async function getMovieInfo(movieCd) {
  // 영화코드를 지정합니다.

  let url = new URL(
    `https://kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=${API_KEY}&movieCd=${movieCd}`
  );

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    return data.movieInfoResult.movieInfo;
  } catch (error) {
    console.log(error);
  }
}

// 무한스크롤
const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      moviesPage++;
      insertMovies(moviesPage);
    }
  },
  { rootMargin: '0px', threshold: 1.0 }
);

observer.observe(moviesLoading);

(async function () {
  try {
    todayBoxOffice = await getDailyBoxOffice(targetDt);
    // weekBoxOffice = await getWeeklyBoxOffice(weeklyTargetDt);

    insertBoxOffice('today');
    insertMovies();
  } catch (error) {
    console.error(error);
  }
})();

(async function () {
  try {
    weekBoxOffice = await getWeeklyBoxOffice(weeklyTargetDt);
  } catch (error) {
    console.error(error);
  }
})();
