// const API_KEY = config.API_KEY;
require('dotenv').config();
const API_KEY = process.env.API_KEY;

const url = new URL(window.location.href);
const myParam = url.searchParams.get('movieCd');
const movieDetail = document.querySelector('.movie_detail');

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

    await drawMovieDetail(data.movieInfoResult.movieInfo);
    //
  } catch (error) {
    console.log(error);
  }
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

async function drawMovieDetail(info) {
  console.log(info);
  let img = await getMovieImg(info.movieCd);
  let openDt =
    info.openDt.substring(0, 4) +
    '.' +
    info.openDt.substring(4, 6) +
    '.' +
    info.openDt.substring(6, 8);

  let noActor = '배우 정보가 없습니다.';
  let detailMsg = `
  <div class="detail_wrap">
    <div class="img_box">
        <img src="${
          img.imgUrl === ''
            ? 'http://www.myeongin.net/app/dubu_board/docs/imgs/d/lg_d16124045780126_%EC%9D%B4%EB%AF%B8%EC%A7%80%EC%A4%80%EB%B9%84%EC%A4%91.jpg'
            : img.imgUrl
        }" alt="">
    </div>
    <div class="txt_box">
        <table>
            <tbody>
              <tr><td>영화제목</td><td>${info.movieNm}</td></tr>
              <tr><td>영화감독</td><td>${
                info.directors[0] ? info.directors[0].peopleNm : '미정'
              }</td></tr>
              <tr><td>배우</td><td>${
                info.actors.map((el) => (el = el.peopleNm))[0]
                  ? info.actors.map((el) => (el = el.peopleNm))[0]
                  : '배우정보 미제공'
              }</td></tr>
              <tr><td>장르</td><td>${info.genres.map(
                (el) => (el = el.genreNm)
              )}</td></tr>
              <tr><td>상영시간</td><td>${info.showTm}분</td></tr>
              <tr><td>개봉상태</td><td>${info.prdtStatNm}</td></tr>
              <tr><td>개봉</td><td>${openDt}</td></tr>
            </tbody>
        </table>
       
    </div>
    </div>
    `;

  movieDetail.innerHTML = detailMsg;
}

getMovieInfo(myParam);
/* 
<dl>
<dt><h2>영화제목: ${info.movieNm}</h2></dt>
<dd>영화감독: ${
  info.directors[0] ? info.directors[0].peopleNm : '미정'
}</dd>
<dd>배우: ${info.actors.map((el) => (el = el.peopleNm))}</dd>
<dd>장르: ${info.genres.map((el) => (el = el.genreNm))}</dd>
<dd>상영시간: ${info.showTm}분</dd> 
<dd>개봉상태: ${info.prdtStatNm}</dd>
<dd>개봉: ${openDt}</dd>
</dl> 
*/
